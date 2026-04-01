# SahyaGPT — Application Errors & Improvement Plan

> Audit date: 2026-04-01
> Primary focus: chat continuation after cut-off, plus all other bugs found across all pages.

---

## Table of Contents

1. [Critical Bugs](#1-critical-bugs)
2. [High Severity Bugs](#2-high-severity-bugs)
3. [Medium Severity Bugs](#3-medium-severity-bugs)
4. [Page-by-Page Summary](#4-page-by-page-summary)
5. [Improvements Needed](#5-improvements-needed)
6. [Priority Order](#6-priority-order)

---

## 1. Critical Bugs

### 1.1 — Line Buffer Data Loss at Stream End (`streamResponse`)

**File:** `index.html`
**Line:** ~4636
**Severity:** CRITICAL — Last chunk of a response can be silently dropped

**Buggy code:**
```js
lineBuffer = done ? '' : (lines.pop() ?? '');
```

When `done === true`, `lineBuffer` is cleared entirely. However, `lines.pop()` is called *before* that assignment and the popped line — which could be the final incomplete line — is never processed. If the stream ends without a trailing newline, the last data line is discarded.

**Impact:** The final sentence/word of an AI response can be lost, making the message appear cut off even when the model fully responded.

**Fix needed:** When `done` is true, do not discard the last line — process it as-is before clearing the buffer.

---

### 1.2 — No Line Buffering in `continueResponse` (LiteLLM path)

**File:** `index.html`
**Line:** ~4208–4228
**Severity:** CRITICAL — Tokens split across chunk boundaries are silently dropped

**Buggy code:**
```js
const chunk = decoder.decode(value, { stream: true });
const lines = chunk.split('\n').filter(line => line.trim());
```

Unlike `streamResponse` which maintains a `lineBuffer` across `reader.read()` calls, `continueResponse` naively splits each raw chunk. A single SSE message (e.g., `data: {"choices":[...]}`) can be split across two chunks at a network boundary. The partial line in the first chunk is discarded, and the remainder in the second chunk fails to parse.

**Impact:** Words/tokens are lost during chat continuation, producing incomplete or garbled continuations.

**Fix needed:** Add the same `lineBuffer` pattern used in `streamResponse` to both the LiteLLM and Ollama paths in `continueResponse`.

---

### 1.3 — No Line Buffering in `continueResponse` (Ollama path)

**File:** `index.html`
**Line:** ~4253–4268
**Severity:** CRITICAL — Same as 1.2 but for the Ollama NDJSON format

**Buggy code:**
```js
const chunk = decoder.decode(value, { stream: true });
const lines = chunk.split('\n').filter(line => line.trim());
for (const line of lines) {
    try {
        const parsed = JSON.parse(line);
        ...
    } catch (e) {}
}
```

Each Ollama NDJSON message is one JSON object per line. If a read chunk cuts a JSON object mid-way, the partial object fails `JSON.parse` and falls into the empty catch — silently dropped.

**Impact:** Same as 1.2 — continuation tokens are lost when streaming via Ollama.

---

## 2. High Severity Bugs

### 2.1 — Silent Exception Swallowing in `continueResponse`

**File:** `index.html`
**Lines:** ~4225 (LiteLLM), ~4266 (Ollama)
**Severity:** HIGH — Errors are invisible, making debugging impossible

**Buggy code:**
```js
} catch (e) {}
```

Both stream parsing loops swallow every exception without logging. JSON parse errors (from corruption, proxy mangling, malformed responses) are silently ignored. There is no way to detect when tokens are being dropped.

**Fix needed:** At minimum, log to console: `catch (e) { console.warn('Stream parse error:', e, 'line:', line); }`

---

### 2.2 — Partial Response Not Saved on Generic Error

**File:** `index.html`
**Lines:** ~4707–4711
**Severity:** HIGH — Content is lost on any non-AbortError, non-TypeError error

**Buggy code:**
```js
} else {
    console.error('Error streaming response:', error);
    this.hideTypingIndicator();
    this.showToast('Error: ' + error.message, 'error');
    // renderers never finalized, message never saved
}
```

The `AbortError` and `TypeError` paths both save partial content. Any other error (e.g., network timeout, HTTP error after stream starts) enters this `else` branch where renderers are not finalized and `addMessage` is never called. All streamed content is discarded.

**Fix needed:** Finalize renderers and save `fullResponse` in the `else` branch too, if `fullResponse.trim()` is non-empty.

---

### 2.3 — Abort During Continuation Does Not Restore Consistent State

**File:** `index.html`
**Lines:** ~4277–4282
**Severity:** HIGH — Aborted continuation may leave message in inconsistent state

**Buggy code:**
```js
if (error.name === 'AbortError') {
    if (continuationContent.trim()) {
        this.saveMessages();
        this.renderMessages();
    }
}
```

`msg.content` has already been mutated live (line 4221: `msg.content = originalContent + continuationContent`). When the user aborts with no `continuationContent`, the message object's `content` field may already contain a partial mid-stream mutation that never gets saved or reverted. The message array is inconsistent with what's on screen.

**Fix needed:** Always call `this.saveMessages()` on abort (not only when `continuationContent.trim()` is truthy), since `msg.content` is mutated regardless.

---

### 2.4 — Model Resolution Falls Back to DOM Text

**File:** `index.html`
**Lines:** ~4111–4115
**Severity:** HIGH — Fragile, can silently use the wrong model for continuation

**Buggy code:**
```js
if (!modelId) {
    const dropdownText = document.getElementById('dropdownText');
    if (dropdownText && dropdownText.textContent && ...) {
        modelId = dropdownText.textContent.trim();
    }
}
```

Reading a model identifier from visible DOM text is brittle. The dropdown may show a display name rather than the API model ID. If the user has switched models since the original message, the continuation silently uses a different model with no warning.

**Fix needed:** Store `modelId` and `provider` on every message at creation time (already attempted at lines 4296–4301) and remove the DOM text fallback entirely.

---

## 3. Medium Severity Bugs

### 3.1 — `isIncompleteResponse` False Positives

**File:** `index.html`
**Lines:** ~4030–4080
**Severity:** MEDIUM — "Continue" button shown for complete responses

The phrase-based detection includes patterns like `\blet me\b` and `\bi will\b`. This triggers the Continue button on fully-complete responses such as:
- "Let me know if you have questions."
- "I will be happy to help."

**Fix needed:** Narrow detection to structural signals only: unclosed code fences (` ``` `), unclosed `<` HTML tags, sentences ending mid-word, or explicit `[truncated]` markers. Remove the broad phrase list.

---

### 3.2 — `continueResponse` Uses Full Re-render Instead of `StreamRenderer`

**File:** `index.html`
**Lines:** ~4222, ~4263
**Severity:** MEDIUM — Visual flicker and performance regression during continuation

**Buggy code:**
```js
msg.content = originalContent + continuationContent;
this.renderAIContent(bubble, msg.content);
```

`renderAIContent` re-parses and re-renders the entire message content on every token. `streamResponse` uses the optimised `StreamRenderer` class for incremental updates. Continuation streams rebuild the entire DOM subtree dozens of times per second, causing:
- Visual flicker/reflow on large responses
- Code block syntax highlighting applied mid-token (produces broken highlights)
- Higher CPU usage

**Fix needed:** Instantiate a `StreamRenderer` at continuation start (pointed at the tail of the bubble) and use it for incremental updates, matching the `streamResponse` approach.

---

### 3.3 — YandexGPT Conversation History Built as Plain Text

**File:** `index.html`
**Lines:** ~4545–4549
**Severity:** MEDIUM — Context fidelity degraded for YandexGPT conversations

**Buggy code:**
```js
const conversationHistory = this.messages.map(m => {
    if (m.role === 'user') return `User: ${m.content}`;
    return `Assistant: ${m.content}`;
}).join('\n\n');
```

YandexGPT is accessed via a proxy that speaks the OpenAI `/chat/completions` format. Building history as a concatenated string instead of a `messages` array means:
- Turn boundaries are text markers, not API roles
- Messages containing the literal text "User:" or "Assistant:" corrupt the format
- Token counting is inaccurate

**Fix needed:** Use the structured `messages` array format (same as the LiteLLM path) for YandexGPT, since the proxy already supports it.

---

### 3.4 — `addMessage` Sets Inconsistent Message Schema

**File:** `index.html`
**Line:** ~4295
**Severity:** MEDIUM — `model`/`provider` missing from some messages; continuation logic degrades

**Buggy code:**
```js
const message = { role, content, timestamp: Date.now(), images };
if (modelId) { message.model = modelId; }
if (provider) { message.provider = provider; }
```

User messages are added via `addMessage('user', ...)` without a `modelId` or `provider`. AI messages added during an error path (line 4696) may omit these too. Old messages loaded from `localStorage` will not have them. The `continueResponse` fallback chain (bugs 2.4) is a direct consequence of this inconsistency.

**Fix needed:** Always include `model` and `provider` on AI messages (default to `null`). Never omit fields — use explicit `null` so consumers can distinguish "unknown" from "not set".

---

### 3.5 — Race Condition: Stale Global Element IDs Between Streams

**File:** `index.html`
**Lines:** ~4717–4722
**Severity:** MEDIUM — Edge case where a second stream can grab the wrong DOM node

The `finally` block strips `id="streamingMessage"` and `id="streamContent"` from the DOM after each stream. However, if `streamResponse` is re-entered quickly (e.g., a new message is submitted while cleanup is in flight), the new call's `getElementById('streamContent')` could momentarily match the old element.

**Fix needed:** Replace the global string IDs with closure-scoped DOM references. Pass the element reference directly rather than looking it up by ID.

---

## 4. Page-by-Page Summary

### `index.html` — Main Chat

| # | Location | Issue | Severity |
|---|----------|-------|----------|
| 1 | `streamResponse` ~4636 | Line buffer cleared on `done`, last line dropped | CRITICAL |
| 2 | `continueResponse` ~4208 | No line buffer (LiteLLM) | CRITICAL |
| 3 | `continueResponse` ~4253 | No line buffer (Ollama) | CRITICAL |
| 4 | `continueResponse` ~4225, 4266 | Silent `catch (e) {}` | HIGH |
| 5 | `streamResponse` ~4707 | Partial response not saved on generic error | HIGH |
| 6 | `continueResponse` ~4277 | Abort leaves message in inconsistent state | HIGH |
| 7 | `continueResponse` ~4111 | Model resolved from DOM text | HIGH |
| 8 | `isIncompleteResponse` ~4030 | Phrase-based detection causes false positives | MEDIUM |
| 9 | `continueResponse` ~4222 | Full re-render on every token (no StreamRenderer) | MEDIUM |
| 10 | YandexGPT history ~4545 | History concatenated as string, not message array | MEDIUM |
| 11 | `addMessage` ~4295 | Inconsistent message schema (`model`/`provider` may be absent) | MEDIUM |
| 12 | `streamResponse` finally ~4717 | Stale global element ID race condition | MEDIUM |

### `imagine.html` — Image Generation

- No critical chat/stream bugs found.
- Uses `localStorage` for gallery persistence — no server-side backup. If storage is cleared, all generated image history is lost. Consider adding an export/backup feature.

### `prompthub.html` — Prompt Hub

- No stream/chat bugs found.
- Prompt data is stored in `localStorage` only. Same persistence risk as `imagine.html`.

### `sw.js` — Service Worker

- No bugs found. Standard cache-first strategy.

---

## 5. Improvements Needed

### 5.1 Unify Stream Parsing Into a Shared Helper

Both `streamResponse` and `continueResponse` implement independent stream reading loops. This duplication is the root cause of bugs 1.2 and 1.3. Extract the loop into a single reusable generator or utility function:

```js
async function* readSSEStream(reader, decoder) { ... }  // for LiteLLM/OpenAI
async function* readNDJSONStream(reader, decoder) { ... }  // for Ollama
```

Both callers then iterate over the same generator, eliminating the divergence.

---

### 5.2 Replace Phrase Detection With Structural Heuristics

`isIncompleteResponse` should be rewritten to check only for structural incompleteness:

- Unmatched code fences (odd count of ` ``` `)
- Unclosed `<` in HTML output
- Response ends mid-sentence (no terminal punctuation)
- Explicit truncation markers (`[truncated]`, `[cut off]`, `...`)

Remove broad keyword phrases (`let me`, `i will`, `to be continued`, etc.) that produce false positives.

---

### 5.3 Persist Model Info Reliably on Every AI Message

All AI messages should carry `model` and `provider` at creation time with no DOM fallbacks. If the model is unknown, store `null` explicitly and surface a UI warning when the user attempts continuation without a model selected.

---

### 5.4 Use `StreamRenderer` for Continuation Updates

Continuation should mirror the main stream path: create a `StreamRenderer` instance pointed at the live bubble and call `renderer.update(token)` on each token, then `renderer.finalize()` at the end or on abort.

---

### 5.5 Save Partial Content in All Error Paths

The error handling in `streamResponse` should always attempt to save `fullResponse` if non-empty, regardless of the error type. Add renderer finalization and `addMessage` calls to the generic `else` branch.

---

### 5.6 Add Structured Logging for Stream Parse Errors

Replace empty `catch (e) {}` blocks with logged warnings. This enables debugging in production without exposing errors to end users:

```js
catch (e) {
    console.warn('[stream] JSON parse error on line:', JSON.stringify(line), e);
}
```

---

### 5.7 Export / Backup for localStorage Data (`imagine.html`, `prompthub.html`)

Both pages store all user data in `localStorage` with no server backup. Add an "Export" button that downloads a JSON snapshot of prompts and image generation history.

---

## 6. Priority Order

| Priority | Bug / Improvement | Reason |
|----------|-------------------|--------|
| P0 | Bug 1.1 — Line buffer cleared on `done` | Drops last chunk of every response |
| P0 | Bug 1.2 — No line buffer in `continueResponse` (LiteLLM) | Core feature broken |
| P0 | Bug 1.3 — No line buffer in `continueResponse` (Ollama) | Core feature broken |
| P1 | Bug 2.1 — Silent `catch (e) {}` | Masks all stream errors |
| P1 | Bug 2.2 — Partial response not saved on generic error | Data loss |
| P1 | Bug 2.3 — Abort leaves inconsistent state | Data corruption |
| P1 | Bug 2.4 — Model resolved from DOM text | Wrong model used silently |
| P2 | Improvement 5.1 — Unified stream helper | Prevents future divergence |
| P2 | Bug 3.1 — False positive incomplete detection | UX annoyance |
| P2 | Bug 3.2 — Full re-render on continuation tokens | Performance / flicker |
| P3 | Bug 3.3 — YandexGPT plain-text history | Context quality |
| P3 | Bug 3.4 — Inconsistent message schema | Long-term data integrity |
| P3 | Bug 3.5 — Global ID race condition | Rare edge case |
| P3 | Improvement 5.7 — Export for localStorage | Data safety |
