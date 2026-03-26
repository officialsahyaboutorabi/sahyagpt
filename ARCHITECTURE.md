# SahyaGPT Architecture Documentation

## Overview

SahyaGPT is a modern, feature-rich chat interface for AI language models. It's built as a single-page application (SPA) using vanilla JavaScript, HTML, and CSS. The application supports multiple AI providers (Ollama, LiteLLM, YandexGPT) and provides a sleek, responsive UI with advanced features like file attachments, web search, extensible skills, AI image/video generation, and intelligent continuation of incomplete responses.

---

## Table of Contents

1. [Project Structure](#project-structure)
2. [Architecture Overview](#architecture-overview)
3. [Core Components](#core-components)
4. [Data Flow](#data-flow)
5. [Key Features](#key-features)
6. [Technology Stack](#technology-stack)
7. [Class Architecture](#class-architecture)
8. [State Management](#state-management)
9. [Provider Integration](#provider-integration)
10. [File Structure](#file-structure)

---

## Project Structure

```
sahyagpt/
├── index.html                   # Main chat application (SPA)
├── imagine.html                # AI Image/Video generation interface
├── 404.html                    # Custom 404 error page
├── fonts.css                   # Custom font definitions
├── sw.js                       # Service Worker (PWA support)
├── ARCHITECTURE.md             # This documentation file
├── CHANGELOG.md                # Version history
├── YANDEXGPT_PROXY.md          # YandexGPT proxy setup guide
├── .nojekyll                   # Disables Jekyll processing for GitHub Pages
├── CNAME                       # Custom domain configuration
├── yandexgpt-proxy.js          # Cloudflare Worker proxy for YandexGPT
├── yandexgpt-proxy-deno.ts     # Deno Deploy proxy for YandexGPT
├── yandexgpt-proxy-node.js     # Node.js proxy for YandexGPT
├── skills/                     # Skill templates and documentation
│   ├── SKILL_TEMPLATE.md       # Template for creating new skills
│   └── ui-developer.md         # UI Developer skill example
└── backups/                    # Backup versions (not in production)
```

---

## Architecture Overview

### Pattern: Single-Page Application (SPA)

SahyaGPT follows the SPA architecture pattern where the entire application lives in a single HTML file (`index.html`). All routing, state management, and UI updates are handled client-side via JavaScript.

### Key Architectural Decisions

1. **No Build Step**: Pure vanilla JavaScript without bundlers or transpilers
2. **Component-Based UI**: UI organized into logical components (ChatApp, StreamRenderer, ToolCard, etc.)
3. **Event-Driven**: Heavy use of event listeners for user interactions
4. **Local Storage Persistence**: Chat history and settings stored in browser's localStorage
5. **Streaming-First**: Built around streaming responses from AI providers

---

## Core Components

### 1. ChatApp (Main Application Class)

**File**: `index.html` (lines 2129-3543)

The central controller class that manages the entire application state and coordinates between components.

**Responsibilities**:
- Application initialization (`init()`)
- Chat session management (create, load, delete)
- Message handling (add, render, stream)
- Provider coordination (Ollama, LiteLLM)
- Settings management
- File attachment handling
- UI state management

**Key Properties**:
```javascript
this.messages = [];           // Current chat messages
this.currentChatId = null;    // Active chat ID
this.chats = [];              // All chat sessions
this.settings = {};           // User settings
this.models = [];             // Available AI models
this.currentModel = null;     // Selected model
this.attachedFiles = [];      // Pending file attachments
```

### 2. StreamRenderer

**File**: `index.html` (lines 1523-1656)

Handles real-time streaming of AI responses with animated text rendering.

**Features**:
- Token-by-token fade-in animation
- Code block detection and syntax highlighting
- Automatic mode switching (fade vs typewriter)
- Markdown parsing on finalize

### 3. ReasoningRenderer & ChainOfThought

**File**: `index.html` (lines 1995-2127, 1891-1918)

Renders reasoning/thinking blocks from models like DeepSeek R1 and QwQ.

**Features**:
- Collapsible reasoning blocks
- Streaming indicator animations
- Auto-close after streaming completes
- Markdown support within reasoning

### 4. ToolCard

**File**: `index.html` (lines 1664-1763)

Displays tool calls (like web search) with rich formatting.

**States**:
- `input-streaming`: Tool is being called
- `input-available`: Input ready
- `output-available`: Results ready
- `output-error`: Error occurred

### 5. AIAvatar

**File**: `index.html` (lines 1336-1451)

Canvas-based animated avatar with eye-tracking.

**Features**:
- Mouse-following eyes
- Breathing animation
- Glow effects
- Customizable size

### 6. Starfield Animation

**File**: `index.html` (lines 1252-1317)

Background particle system for visual appeal.

---

## Data Flow

### 1. Message Submission Flow

```
User Input
    ↓
handlePromptSubmit()
    ↓
Process Attached Files (if any)
    ↓
addMessage('user', content, images)
    ↓
Save to localStorage
    ↓
Render Message (createMessageElement)
    ↓
streamResponse()
    ↓
Provider-Specific API Call
    ↓
StreamRenderer (real-time display)
    ↓
addMessage('ai', fullResponse)
    ↓
Save to localStorage
```

### 2. File Attachment Flow

```
File Selection (fileInput)
    ↓
handleFileSelect()
    ↓
Store File Objects (attachedFiles array)
    ↓
renderFileAttachments() (display chips)
    ↓
On Submit: processAttachedFiles()
    ↓
├─ Text Files → Read as text → Include in message content
├─ Images → Read as dataURL → Store in pendingImageFiles[]
└─ Other → Reference by name/size
    ↓
addMessage('user', content, images)
    ↓
Render with inline image display (createMessageElement)
    ↓
Click image → openImagePreview() → Fullscreen modal
```

### 3. Settings Persistence Flow

```
User Changes Setting
    ↓
saveSettings()
    ↓
Update this.settings object
    ↓
localStorage.setItem('chatSettings')
    ↓
On Load: loadSettings()
    ↓
Retrieve from localStorage
    ↓
Populate UI Elements
```

---

## Key Features

### 1. Multi-Provider Support

**Ollama** (Local Models):
- Endpoint: `http://localhost:11434`
- Protocol: Custom Ollama API
- Streaming: NDJSON format

**LiteLLM** (Cloud Models):
- Endpoint: `https://llm.nexiant.ai`
- Protocol: OpenAI-compatible API
- Streaming: SSE format

### 2. File Attachments

**Supported Types**:
- Text files (read as text)
- Images (displayed inline as data URLs)
- Other files (referenced by name/size)

**UI**:
- File chips above textarea
- Remove button per file
- Multiple file support
- Inline image display in chat bubbles

### 3. Web Search Integration

**Flow**:
1. User toggles search mode
2. On submit: `performWebSearch()` called
3. Searches DuckDuckGo + Wikipedia
4. Results shown in ChainOfThought component
5. LLM prompted with search results

### 4. Chat Management

**Features**:
- Multiple concurrent chats
- Auto-generated titles from first message
- Persistent chat history
- Delete individual chats
- Sidebar navigation with history

### 5. Streaming Response Handling

**Unified Stream Loop**:
- Handles both NDJSON (Ollama) and SSE (LiteLLM)
- Provider detection: `this.currentModel.provider`
- Token extraction and routing to renderers
- Thinking block detection and separation

### 6. Comprehensive Skills System

**Architecture**: SkillsManager class + ChatApp integration

**Components**:
- **SkillsManager**: Central controller for skill CRUD operations
- **Built-in Skills**: 6 pre-defined skills (Brainstorming, Code Review, Debugging, Writing, ELI5, Socratic Tutor)
- **Custom Skills**: User-created skills stored in localStorage
- **Skills Library Modal**: Browse, search, and activate skills
- **Skill Editor Modal**: Create and edit custom skills
- **Active Skill Integration**: Skill content injected into system prompt

**Data Flow**:
```
User Selects Skill
    ↓
SkillsManager.applySkill(skillId)
    ↓
Store active skill in localStorage
    ↓
Update UI indicators (header badge, Apply Skill button)
    ↓
ChatApp.getSystemPromptWithSkill()
    ↓
Append skill content to system prompt
    ↓
Send to LLM with enhanced instructions
```

**Storage**:
- **localStorage Key**: `sahyagpt_custom_skills` - Array of custom skill objects
- **localStorage Key**: `sahyagpt_active_skill` - Currently active skill ID/name

**Skill Object Structure**:
```javascript
{
    id: 'skill_timestamp',
    name: 'Skill Name',
    description: 'What this skill does',
    category: 'Development',
    content: 'Full skill instructions for AI...',
    builtin: false,
    createdAt: '2026-03-24T...'
}
```

**File Format (Markdown with YAML Frontmatter)**:
```markdown
---
name: "my-skill"
description: "Brief description"
version: "1.0.0"
category: "Development"
---

# Skill Name

## Instructions
When this skill is active...
```

**UI Components**:
- **Apply Skill Button**: Dropdown selector in Skills Library modal
- **Active Skill Indicator**: Header badge showing current skill
- **Skill Cards**: Display in library with actions (Apply, Edit, Delete, Export)
- **Skill Editor**: Form for creating/editing skills

### 7. Image Preview Modal

**Features**:
- Click any image in chat to open fullscreen preview
- Escape key to close
- Click outside to close
- Smooth fade animation
- Image caption display

**Implementation**:
- CSS overlay with backdrop blur
- Modal container with close button
- Global functions: `openImagePreview()`, `closeImagePreview()`

### 8. Enhanced Sidebar Navigation

**Structure**:
- **Chat History**: Collapsible section with navigation title
- **Create Skills**: Template download and new skill creation
- **Skills Library**: Browse all 100+ available skills
- Each section has consistent nav-title styling

**Nav Title Component**:
```html
<div class="nav-title">
    <div class="title-label">
        <svg class="nav-icon">...</svg>
        <span>Section Name</span>
    </div>
</div>
```

### 9. Imagine Page (Image/Video Generation)

**File**: `imagine.html`

A dedicated interface for AI-generated images and videos using HuggingFace Inference API.

**Features**:
- **Mode Toggle**: Switch between Image and Video generation
  - Animated slider with orange background
  - Smooth CSS transitions (cubic-bezier easing)
  - Equal 4px padding maintained on both sides
- **Aspect Ratio Grid**: Visual selector for output dimensions
  - 2:3, 3:2, 1:1, 9:16, 16:9 presets
  - Maps to specific pixel dimensions (512x768, etc.)
- **Image Upload**: Drag & drop zone for video generation source
  - File validation (images only)
  - Preview thumbnail display
- **Results Gallery**: Grid of generated content
  - Image/video cards with metadata
  - Action buttons: Download, Upscale, Redo
- **API Integration**: HuggingFace Inference API
  - Text-to-image (e.g., FLUX.1-dev)
  - Image-to-video (e.g., WAN 2.1)
  - 4x upscaling support

**Architecture**:
```
imagine.html (SPA)
├── Starfield Background (shared with index.html)
├── Sidebar Navigation (identical structure to index.html)
├── Header
│   ├── Mode Toggle (Image/Video)
│   └── Status Indicator
├── Main Content
│   ├── Upload Section (video mode only)
│   ├── Prompt Input
│   ├── Aspect Ratio Selector
│   └── Generate Button
└── Results Gallery
```

### 10. Continue Button for Incomplete Responses

**Detection Logic**:
- Unclosed code blocks (odd number of triple backticks)
- Mid-sentence endings (doesn't end with punctuation)
- Unclosed HTML tags
- Continuation phrases at the end

**Implementation**:
- **UI**: Orange pulsing button appears in message actions bar
- **Trigger**: `isIncompleteResponse()` analyzes message content
- **Continuation**: Sends conversation context + continue prompt
- **Streaming**: Updates existing message bubble in real-time
- **Providers**: Works with Ollama, LiteLLM, and YandexGPT

### 11. Scroll to Bottom Button

**File**: `index.html`

A floating button that appears when the user scrolls up in the chat, allowing quick navigation to the latest messages.

**Features**:
- **Smart visibility** - Shows when scrolled >100px from bottom
- **Performance optimized** - Throttled scroll handler using requestAnimationFrame
- **Smooth animations** - CSS transitions for show/hide and hover effects
- **Glassmorphism design** - Backdrop blur with border accent

**Implementation**:
```javascript
// Scroll detection with throttling
handleScroll() {
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
    if (distanceFromBottom > 100) showButton();
    else hideButton();
}
```

**CSS Classes**:
- `.scroll-to-bottom-btn` - Main button styling
- `.scroll-to-bottom-btn.visible` - Visible state
- `@keyframes bounce-down` - Hover animation

---

### 12. YandexGPT Integration

**File**: `index.html` (settings and streaming logic)

Integration with Yandex Cloud Foundation Models (Alice AI).

**Supported Models**:
- `yandexgpt` - YandexGPT Pro (flagship)
- `yandexgpt-lite` - YandexGPT Lite (faster)
- `aliceai-llm/latest` - Alice AI (alice.yandex.ru)

**CORS Proxy** (required for browser):
- `yandexgpt-proxy.js` - Cloudflare Worker deployment
- `yandexgpt-proxy-deno.ts` - Deno Deploy deployment  
- `yandexgpt-proxy-node.js` - Node.js/Express server

**API Details**:
- Endpoint: `https://ai.api.cloud.yandex.net/v1/responses`
- Auth: `Api-Key` header + `OpenAI-Project` header (folder ID)
- Model URI: `gpt://<folder-id>/<model-name>/latest`

---

## Technology Stack

### Core Technologies
- **HTML5**: Semantic markup, custom data attributes
- **CSS3**: Custom properties, flexbox, grid, animations
- **Vanilla JavaScript (ES6+)**: Classes, async/await, modules

### External Libraries (CDN)
- **marked.js**: Markdown parsing
- **highlight.js**: Syntax highlighting for code blocks
- **Google Fonts**: SB Sans Text, Inter

### Browser APIs
- **localStorage**: Persistent storage
- **FileReader**: File content reading
- **Fetch API**: HTTP requests to AI providers
- **ResizeObserver**: Dynamic layout adjustments
- **SpeechRecognition**: Voice input (Web Speech API)
- **Canvas API**: Avatar animations

### PWA Features
- **Service Worker**: `sw.js` for offline support
- **Manifest**: (can be added for installable PWA)

---

## Class Architecture

```
ChatApp (Main Controller)
├── State Management
│   ├── messages[]
│   ├── chats[]
│   ├── settings{}
│   ├── attachedFiles[]
│   ├── pendingImageFiles[]
│   └── skillsManager (SkillsManager instance)
├── UI Components
│   ├── initPromptInput()
│   ├── initScrollButton()
│   ├── renderMessages()
│   ├── renderFileAttachments()
│   ├── createMessageElement()
│   ├── scrollToBottom()
│   ├── showScrollToBottomButton()
│   └── hideScrollToBottomButton()
├── Provider Integration
│   ├── fetchModels()
│   ├── streamResponse()
│   └── getSystemPromptWithSkill()
├── Skills (delegated to SkillsManager)
│   ├── downloadSkillTemplate()
│   ├── createNewSkill()
│   └── viewSkills()
└── Utilities
    ├── formatFileSize()
    ├── escapeHtml()
    ├── processAttachedFiles()
    └── save/loadSettings()

SkillsManager (Skill Management)
├── State Management
│   ├── builtInSkills[] (6 pre-defined skills)
│   ├── customSkills[] (user-created)
│   └── activeSkill (currently applied)
├── Skill CRUD
│   ├── createNewSkill()
│   ├── editSkill(skillId)
│   ├── deleteSkill(skillId)
│   ├── exportSkill(skillId)
│   └── importSkillFromFile()
├── UI Methods
│   ├── openSkillsLibrary()
│   ├── openSkillEditor(skill)
│   ├── renderSkillsList()
│   ├── renderSkillSelectorOptions()
│   ├── toggleSkillSelector()
│   └── closeSkillSelector()
├── Skill Activation
│   ├── applySkill(skillId)
│   ├── clearActiveSkill()
│   ├── updateActiveSkillUI()
│   └── getActiveSkillContent()
├── Persistence
│   ├── loadCustomSkills()
│   ├── saveCustomSkills()
│   └── loadActiveSkill()
└── Utilities
    ├── parseSkillMarkdown()
    ├── updateSkillsCount()
    └── escapeHtml()

StreamRenderer (Text Animation)
├── update(fullText)
├── finalize()
└── Private: _textChar(), _codeChar()

ReasoningRenderer (Thinking Blocks)
├── update(thinkingText)
├── finalize()
└── _toggle(), _setOpen()

ToolCard (Tool Display)
├── update(toolPart)
├── _render()
└── _toggle()

AIAvatar (Canvas Animation)
├── init()
├── animate()
└── draw()

ChainOfThought (Multi-step Display)
├── addStep()
└── ChainOfThoughtStepEl class

ImagineApp (Image/Video Generation Controller)
├── State Management
│   ├── currentMode ('image' | 'video')
│   ├── selectedRatio ('2:3' | '3:2' | '1:1' | '9:16' | '16:9')
│   ├── uploadedImage (File | null)
│   ├── results[]
│   └── isGenerating (boolean)
├── UI Components
│   ├── updateModeSlider() - Animated mode toggle
│   ├── selectAspectRatio() - Ratio grid selection
│   ├── handleImageUpload() - Drag & drop handling
│   └── renderResults() - Gallery display
├── API Integration
│   ├── generateImage() - HuggingFace text-to-image
│   ├── generateVideo() - HuggingFace image-to-video
│   └── upscaleImage() - 4x upscaling
└── Utilities
    ├── saveSettings() - API key persistence
    ├── downloadImage() - Save to disk
    └── formatFileSize()
```

---

## State Management

### Local State (this.*)
- `messages`: Current chat message array
- `chats`: All chat sessions metadata
- `settings`: User preferences and API keys
- `attachedFiles`: Pending file uploads
- `isGenerating`: Streaming state flag
- `currentModel`: Selected AI model

### Persistent Storage (localStorage)
- **Key**: `chatSettings`
  - Endpoints configuration
  - API keys
  - UI preferences (theme, font size, etc.)
  - Toggles (auto-save, enter-to-send, etc.)
  
- **Key**: `chatHistory`
  - All chat sessions with messages
  - Chat metadata (title, timestamp)

### Session State
- `abortController`: For cancelling streams
- `streamRenderer`: Current streaming instance
- `reasoningRenderer`: Current reasoning block

---

## Provider Integration

### Provider Detection
```javascript
if (this.currentModel.provider === 'litellm') {
    // Use OpenAI-compatible SSE format
} else if (this.currentModel.provider === 'yandexgpt') {
    // Use YandexGPT Responses API
} else {
    // Use Ollama NDJSON format
}
```

### Response Format Handling

**Ollama (NDJSON)**:
```
{"response": "token", "done": false}
{"response": "", "done": true}
```

**LiteLLM/OpenAI (SSE)**:
```
data: {"choices": [{"delta": {"content": "token"}}]}
data: [DONE]
```

**YandexGPT (Responses API)**:
```
POST /v1/responses
{
    "model": "gpt://folder-id/model-name/latest",
    "instructions": "system prompt",
    "input": "user message",
    "temperature": 0.7,
    "max_output_tokens": 2048
}
```

### Unified Parsing
The `streamResponse()` method normalizes both formats into tokens that are fed to `StreamRenderer`.

### Supported Providers

| Provider | Endpoint | Authentication | Models |
|----------|----------|----------------|--------|
| **Ollama** | Local/Custom URL | None | Any local model |
| **LiteLLM** | `https://llm.nexiant.ai` | Bearer Token | Cloud models (GPT-4, Claude, etc.) |
| **YandexGPT** | `https://ai.api.cloud.yandex.net/v1` | Api-Key + OpenAI-Project | yandexgpt, yandexgpt-lite, aliceai-llm |

#### YandexGPT Specifics

**CORS Requirement**: Yandex Cloud API blocks browser requests. A CORS proxy is required.

**Proxy Options**:
1. **Cloudflare Worker** - Deploy `yandexgpt-proxy.js` (recommended)
2. **Deno Deploy** - Deploy `yandexgpt-proxy-deno.ts`
3. **Node.js Server** - Run `yandexgpt-proxy-node.js`

**Authentication**:
- Header: `Authorization: Api-Key <key>`
- Header: `OpenAI-Project: <folder-id>` (Yandex Cloud folder)

**Model URI Format**: `gpt://<folder-id>/<model-name>/latest`

See `YANDEXGPT_PROXY.md` for detailed setup instructions.

---

## File Structure

### CSS Architecture

**Variables (CSS Custom Properties)**:
```css
:root {
    --bg-primary: #0d0d0d;
    --bg-secondary: #121212;
    --text-primary: #fbfbfb;
    --text-secondary: #b7b7b7;
    --accent: #ff4f00;
    --border: #2a2a2a;
    /* ... */
}
```

**Component Classes**:
- `.sidebar` - Navigation sidebar
- `.main-content` - Chat area
- `.message` - Individual message bubble
- `.prompt-kit-container` - Input area
- `.file-chip` - File attachment display
- `.modal` - Settings and dialogs

### JavaScript Organization

**Classes** (in order of appearance):
1. `AIAvatar` - Animated avatar
2. `StreamRenderer` - Text streaming animation
3. `ToolCard` - Tool result display
4. `ChainOfThought` - Multi-step reasoning
5. `ReasoningRenderer` - Collapsible thinking blocks
6. `ChatApp` - Main chat application controller
7. `ImagineApp` - Image/Video generation controller (imagine.html)

**Helper Functions**:
- `parseThinking()` - Extracts `<think>` blocks
- `escapeHtml()` - XSS prevention
- Starfield animation functions

---

## Security Considerations

1. **XSS Prevention**: `escapeHtml()` function used before inserting user content
2. **CORS**: Proxy required for browser-based API calls (LiteLLM)
3. **Local Only**: API keys stored in localStorage (client-side only)
4. **No Server**: All processing happens in browser

---

## Performance Optimizations

1. **Virtual Scrolling**: Messages rendered on demand
2. **Canvas Animation**: Hardware-accelerated avatar
3. **Debounced Resize**: Starfield resize handling
4. **Lazy Loading**: Code highlighting only on finalize
5. **Streaming**: Progressive rendering instead of waiting for full response

---

## Future Extension Points

1. **New Providers**: Add to `fetchModels()` and `streamResponse()`
2. **New Skills**: Add to `skills/` folder and `viewSkills()` modal
3. **New UI Features**: Extend `ChatApp` class with new methods
4. **Custom Themes**: Extend CSS variables and theme switcher
5. **Plugins**: Hook system in message rendering pipeline

---

## Development Guidelines

### Adding a New Provider

1. Add provider detection in `fetchModels()`
2. Add provider handling in `streamResponse()`
3. Update provider list in settings UI
4. Add API key input if needed

### Adding a New Feature

1. Add state to `ChatApp` constructor
2. Add UI elements to HTML
3. Add event handlers in `init()` or `initPromptInput()`
4. Add rendering logic
5. Update `saveSettings()`/`loadSettings()` if persistent

### Styling Guidelines

1. Use CSS variables for colors
2. Follow BEM-like naming: `.component-element--modifier`
3. Mobile-first responsive design
4. Dark theme as default

---

## GitHub Pages Deployment

### Configuration

The project is deployed to GitHub Pages with the following setup:

**Repository Settings:**
- Source: GitHub Actions
- Custom Domain: `sbgpt.qzz.io` (via CNAME file)

### Critical Files

**.nojekyll**
- Empty file that disables Jekyll processing
- Required because the `skills/` folder contains markdown files that would cause Jekyll build failures
- Without this file, GitHub Pages would attempt to process all skill files and fail

**CNAME**
- Contains custom domain: `sbgpt.qzz.io`
- Required for custom domain to work on GitHub Pages

**404.html**
- Custom error page for the SPA
- GitHub Pages serves this for all unmatched routes

### Skills Storage

Skills are stored in the `skills/` directory with the following structure:

```
skills/
├── SKILL_TEMPLATE.md          # Base template for new skills
├── brainstorming/
│   └── SKILL.md               # Skill definition
├── code-review/
│   └── SKILL.md
├── ... (38 total skills)
└── superpowers/
    ├── brainstorming/
    │   └── SKILL.md
    └── ...
```

**Access Pattern:**
- Skills are fetched as static files via `fetch()` or download links
- Each skill folder contains a `SKILL.md` file
- The `downloadSkill()` method constructs paths like `skills/{folder}/SKILL.md`

---

## License

MIT License - See project root for details

---

## Recent Updates (March 26, 2026)

### imagine.html Enhancements

#### Visual Improvements
- **Toggle Button Shimmer Animation**: Active Image/Video toggle buttons now feature an orange gradient shimmer effect matching the chat input border animation
  - CSS `background-clip: text` technique for gradient text
  - Synchronized animation timing and direction with `.shimmer-border`
  - SVG icons show solid orange color when active

#### Bug Fixes
- Fixed JavaScript errors (`t.noHistory undefined`, `modeSlider not defined`)
- Centralized all translations to JSON files (en.json, ru.json)
- Fixed CORS proxy timeout issues for web search
- Added disabled submit button state for empty input
- Fixed toggle slider positioning and duplicate ID conflicts
- Resolved dropdown CSS conflicts between language and aspect ratio selectors

#### Internationalization
- Complete Russian translation for imagine.html
- Fallback text for all translation keys to prevent undefined errors
- Translation system using async JSON loading

#### Web Search Integration
- Yandex Search integration via OpenSerp API
- Multiple CORS proxy fallback support
- Timeout handling: 12s for search sources, 15s for proxies

---

## License

MIT License - See project root for details

---

*Architecture Documentation v1.6*
*Last Updated: March 26, 2026*
