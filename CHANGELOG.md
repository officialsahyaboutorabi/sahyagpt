# Changelog

All notable changes to the SahyaGPT project will be documented in this file.

## [1.4.0] - 2026-03-31

### Added

#### New Code CLI Page (codecli.html)
- **Created dedicated CLI installation page** with modern Qwen Code-inspired design
  - Hero section with gradient title and platform tabs (Linux/macOS & Windows)
  - One-click install command: `curl -fsSL https://sbgpt.qzz.io/install.sh | bash`
  - Windows support: `irm https://sbgpt.qzz.io/install.ps1 | iex`
  - Copy-to-clipboard functionality with visual feedback
  - GitHub repository and documentation links

#### Feature Showcase Section
- **"Why Sahya Code?"** features grid with 4 key highlights:
  - ⚡ Lightning Fast - Efficient streaming and local caching
  - 🔒 Privacy First - On-device processing priority
  - 🚀 Multi-Model Support - OpenAI, Anthropic, Ollama compatible
  - 🛠️ Extensible Tools - Built-in tools + plugin system

#### Usage Documentation
- **Interactive examples** with terminal mockups:
  - Interactive mode - Launch terminal UI with `sahya`
  - Headless mode - Script automation with `sahya -p "prompt"`
  - Configuration - Easy settings management

#### Navigation Updates
- **Added Code CLI link** to sidebar on all pages:
  - index.html, imagine.html, prompthub.html, codecli.html
  - Consistent active state styling across all navigation

---

## [1.3.2] - 2026-03-31

### Changed (imagine.html)

#### Gallery Updates
- **Removed Grok AI demo images** - Gallery now only shows user-generated images
  - Removed all xAI/Grok sample images from gallery
  - Empty state shows "No images yet" message
  - Gallery is now truly personal to each user

---

## [1.3.0] - 2026-03-31

### Fixed (imagine.html)

#### Code Review Fixes
- **Added constants object** - `ImagineApp.CONSTANTS` for all magic numbers
  - `MAX_VIDEO_IMAGES` (7), `GALLERY_BASE_WIDTH` (312), `MAX_GALLERY_ITEMS` (100)
  - `MAX_IMAGE_SIZE_MB` (10), `SIDEBAR_WIDTH` (280), etc.
- **Translations initialization** - Default values in constructor prevent undefined errors
- **Fixed orphan image cleanup** - `deleteHistoryItem()` now removes from:
  - `imageDataStore` (memory)
  - IndexedDB (persistent storage)
  - `galleryImages` array
- **URL validation** - `isValidUrl()` helper validates HTTP/HTTPS URLs
- **Ollama health check** - `isOllamaReachable()` pings server before generation
- **Prompt sanitization** - Basic XSS prevention in `generate()`
- **File size validation** - 10MB limit for uploaded images
- **Gallery size limit** - `cleanupOldGalleryImages()` enforces max 100 items
- **Improved IndexedDB error handling** - Better logging and graceful fallbacks

---

## [1.3.3] - 2026-03-31

### Fixed (index.html)

#### Continue Button Scrolling Bug
- **Fixed non-stop scrolling** when using "Continue" button
  - Throttled `renderAIContent` calls (every 50 chars instead of every chunk)
  - Throttled `scrollToBottom` calls (every 100 chars instead of every chunk)
  - Added final scroll after completion to show result
  - Prevents flickering and smooths the continuation experience

---

## [1.3.1] - 2026-03-31

### Fixed (index.html)

#### Critical Bug Fix
- **Fixed JavaScript syntax error** - Removed orphaned HTML code inside ChatApp class
  - Was causing `SyntaxError: expected property name, got '<'`
  - Also fixed `ReferenceError: chatApp is not defined`
  - 175 lines of legacy modal HTML were incorrectly left inside the JavaScript class

---

## [1.2.9] - 2026-03-31

### Fixed (index.html)

#### Code Analysis Fixes
- **Removed duplicate methods** - `createNewSkill()` and dead `_legacyDownloadSkillTemplate()`
- **Fixed event.target fragility** - `switchSettingsTab` now uses `currentTarget` parameter
- **AIAvatar memory leak fixed** - Added static registry with `destroy()` and `destroyAll()` methods
- **XSS vulnerability patched** - `_appendItem()` now checks content type before using innerHTML
- **Download timing fixed** - `downloadFile()` delays URL cleanup to ensure download starts
- **Search debouncing added** - Skills search input now debounced (150ms)
- **Implemented empty method** - `updateEditButton()` now properly updates button visibility

---

## [1.2.8] - 2026-03-31

### Added

#### IndexedDB Image Storage (imagine.html)
- **Persistent image storage** across page refreshes
  - Uses IndexedDB (`ImagineImagesDB`) for storing generated images
  - Base64 images too large for localStorage now persist properly
  - Images display in chat session after page reload
  - Gallery shows user creations even after browser restart
  - Automatic fallback if IndexedDB is unavailable

#### History Management (imagine.html)
- **Individual history deletion** with trash icon on hover
  - Delete button matches index.html styling (26×26px, red hover)
  - Removes history entry but keeps image in gallery
  - Confirmation toast on deletion

### Fixed

#### Image Display Issues (imagine.html)
- **Images now display correctly** in chat session after generation
- **Gallery shows user images** alongside demo images
- **Fixed ID mismatch** between chat session and storage

#### Error Handling (imagine.html)
- **Improved Ollama error handling** for server crashes
  - Detects empty or corrupted JSON responses
  - Provides clearer error messages when server crashes during generation
  - Parses response as text first before JSON to catch parsing errors
  - Shows helpful message: "The server may have crashed during image generation"

---

## [1.7.0] - 2026-03-31

### Added

#### Ollama Image Generation Integration (imagine.html)
- **Ollama Provider Support** - Local AI image generation using Ollama
  - Supports `x/z-image-turbo` and `x/flux2-klein` models
  - Fetches installed models dynamically from `/api/tags`
  - Filters compatible models automatically
  - Configurable Ollama URL (default: `http://localhost:11434`)
  - Base64 image response handling

#### Chat Session View (imagine.html)
- **New chat-style interface** for image generation
  - Shows user prompt and AI response in conversation format
  - Real-time generation progress with spinner animation
  - Generated image appears in chat when complete
  - Save and Regenerate action buttons
  - "Back to Gallery" button to return to community creations
  - Clicking history item opens the chat session
  - Auto-switches to chat view when pressing Generate

#### Pinterest-Style Masonry Gallery (imagine.html)
- **5-column masonry layout** for community creations
  - Dynamic column calculation based on screen width
  - 1px gap between items
  - Images touch sidebar on left, edge on right
  - Items stay in same column when sidebar toggles
  - Responsive: 5→4→3→2→1 columns based on width
  - Save button appears on hover
  - Support for video previews with autoplay

#### Provider Selection (imagine.html)
- **Image Providers**: Ollama (default) or HuggingFace Endpoint
- **Video Providers**: Ollama or HuggingFace Cloud
- Settings modal with provider-specific configuration
- API key management for HuggingFace

### Fixed

#### UI/UX Improvements (imagine.html)
- **Fixed placeholder overlap** - Placeholder hides when text is entered
- **Invisible scrollbars** - All scrollbars hidden globally
- **Fixed gallery layout** - Properly accounts for sidebar width
- **Centered chat input** - Fixed positioning at bottom with gradient background
- **Modal scrolling** - Settings modal has scrollable body with hidden scrollbar

### Changed

#### Architecture Updates
- Removed Puter AI and OpenRouter providers (replaced with Ollama)
- Chat history stored as conversation objects with messages array
- Gallery displays demo images from xAI when no user creations

---

## [1.6.0] - 2026-03-26

### Added

#### Toggle Button Shimmer Animation (imagine.html)
- **Orange gradient shimmer** on active toggle button text (Image/Video)
  - Matches the shimmer-border animation style exactly
  - Gradient: `#ff5717 → #ffb59e → #ff5717`
  - Animation: Left-to-right movement (2s duration)
  - Uses `background-clip: text` with `-webkit-text-fill-color: transparent`
- **Icon styling** - Active button SVG icons show solid orange color (`#ff5717`)
- **HTML structure cleanup** - Removed unnecessary wrapper divs from toggle buttons

### Fixed

#### JavaScript Error Fixes (imagine.html)
- **Fixed `t.noHistory undefined` error** - Added fallback for missing translation keys
- **Fixed `modeSlider not defined` error** - Changed to correct `chatModeSlider` ID

#### UI/UX Improvements (imagine.html)
- **Centralized translations** - All text moved to en.json/ru.json files
- **Search timeout fixes** - Increased CORS proxy timeouts to 12-15s
- **Disabled submit button state** - Button disabled when input is empty
- **Removed `<base target="_blank">`** - Navigation now opens in same tab
- **Fixed toggle slider positioning** - Correct horizontal placement
- **Centered chat input** - Added `margin: 0 auto` for proper centering
- **Complete Russian translation** - Full i18n support for imagine.html
- **Integrated web search** - Yandex Search and OpenSerp support
- **Reordered layout** - Chat input positioned below empty state
- **Fixed dropdown CSS conflicts** - Language and aspect ratio dropdowns no longer conflict

---

## [1.5.0] - 2026-03-24

### Added

#### Comprehensive Skills System
- **SkillsManager Class** - Complete skill management system
  - Built-in skills: Brainstorming, Code Review, Debugging, Writing, Explain Like I'm 5, Socratic Tutor
  - Custom skills: Create, edit, delete, import, and export your own skills
  - Skills stored in localStorage for persistence
  - Active skill applied to all LLM conversations via system prompt injection

#### Skills Library Modal
- **Interactive skill browser** with search and filter capabilities
- **Skill selector dropdown** in modal header for quick skill activation
- **Grouped by category**: General, Development, Learning, Design, Analysis, Custom
- **Visual indicators**: Green styling for active skills, checkmarks for selection
- **Skill actions**: Apply, Edit, Delete, Export per skill

#### Skill Editor Modal
- **Create and edit custom skills** with full markdown support
- **Metadata fields**: Name, category, description
- **Content editor**: Full instructions for AI behavior
- **YAML frontmatter support** for skill imports

#### File Import/Export
- **Import skills** from markdown files (.md, .markdown, .txt)
- **Parse frontmatter** for name, description, category, content
- **Export skills** as downloadable markdown files
- **Template download** for creating new skills

#### Chat Integration
- **Active skill indicator** in header showing currently applied skill
- **System prompt injection** - Skill content appended to system prompt
- **One-click deactivation** from header indicator or skills modal
- **Persistent activation** across chat sessions

### Changed
- **Sidebar organization**: Removed inline Apply Skill button, moved to Skills Library modal
- **Skills Library UI**: Reorganized with Apply Skill dropdown selector

---

## [1.4.0] - 2026-03-24

### Added

#### Scroll to Bottom Button
- **Floating scroll button** - Appears when user scrolls up in chat
  - Smooth CSS transitions for show/hide animations
  - Bounce animation on hover for visual feedback
  - Backdrop blur and glassmorphism styling
  - Positioned bottom-right of chat container
- **Smart visibility detection** - Shows when scrolled >100px from bottom
  - Uses throttled scroll handler for performance (requestAnimationFrame)
  - Auto-hides when user scrolls to bottom
  - Auto-hides when new messages arrive (scrollToBottom called)
- **CSS animations** - Smooth transitions and hover effects
  - Scale and translate animations
  - Color transition to accent color on hover
  - Box shadow glow effect on hover

---

## [1.3.0] - 2026-03-16

### Added

#### Continue Button for Incomplete Responses
- **Detect incomplete AI responses** - Automatically detects cut-off responses
  - Unclosed code blocks (odd number of triple backticks)
  - Mid-sentence endings
  - Unclosed HTML tags
  - Continuation phrases at the end
- **Continue button UI** - Orange pulsing button appears on incomplete messages
- **Live continuation** - Streams continuation directly into existing message bubble
- **Smart context handling** - Builds conversation history for natural continuation
- **Works with all providers** - Ollama, LiteLLM, and YandexGPT

#### YandexGPT (Alice AI) Integration
- **New provider: YandexGPT** - Full integration with Yandex Cloud Foundation Models
- **Available models:**
  - `yandexgpt` - YandexGPT Pro (flagship model)
  - `yandexgpt-lite` - YandexGPT Lite (faster)
  - `aliceai-llm/latest` - Alice AI (as seen in alice.yandex.ru)
- **CORS Proxy Support** - Includes proxy deployment files for browser compatibility
  - `yandexgpt-proxy.js` - Cloudflare Worker proxy
  - `yandexgpt-proxy-deno.ts` - Deno Deploy proxy
  - `yandexgpt-proxy-node.js` - Node.js/Express proxy
  - `YANDEXGPT_PROXY.md` - Setup guide
- **Settings UI** - API Key, Folder ID, and optional Proxy URL fields
- **Uses Responses API** - `/v1/responses` endpoint for compatibility

### Fixed

#### Continue Button Improvements
- **Model detection** - Uses stored model from message for continuation
- **Provider-specific handling** - Proper endpoint selection per provider
- **Real-time updates** - Message updates live as continuation streams

---

## [1.2.0] - 2026-03-16

### Added

#### Imagine Page - AI Image/Video Generation
- **New page: `imagine.html`** - Dedicated interface for AI image and video generation
- **HuggingFace Integration** - Uses HuggingFace Inference API for generation
- **Dual Mode Toggle** - Switch between Image and Video generation modes
  - Animated sliding orange background for mode indicator
  - Min-width buttons to prevent text reflow during animation
- **Aspect Ratio Selector** - Grid of common ratios (2:3, 3:2, 1:1, 9:16, 16:9)
- **Drag & Drop Upload** - For video generation (image-to-video)
- **Results Gallery** - Grid display of generated images/videos
- **Action Buttons** - Save, upscale, and regenerate for each result
- **API Settings Modal** - HuggingFace API key configuration

#### UI/UX Improvements
- **Synchronized Navigation** - Sidebar structure identical across index.html and imagine.html
- **Same-Tab Navigation** - Removed `<base target="_blank">` for internal navigation
- **Cache Control** - Meta tags to prevent caching issues during updates

### Fixed

#### Mode Toggle Slider
- **Slider positioning** - Fixed slider going outside container bounds when selecting "Video"
- **Used `left` property** instead of `transform: translateX()` for predictable positioning
- **Maintained 4px padding** - Slider now stays properly within toggle container padding

#### GitHub Pages
- **`.nojekyll` file** - Prevents Jekyll processing (fixes skills/ folder build issues)

### Changed

- **ARCHITECTURE.md** - Added ImagineApp class documentation, Imagine page architecture
- **Infinite scroll fix** - Constrained `.main-content` to `height: 100vh` with proper overflow

---

## [1.1.0] - 2025-03-18

### Added

#### Image Preview Modal
- **Fullscreen image preview** - Click any image in chat bubbles to open fullscreen view
- **Backdrop blur effect** - Smooth overlay with backdrop-filter
- **Keyboard navigation** - Press Escape to close the modal
- **Click outside to close** - Intuitive UX for dismissing the preview
- **Image caption display** - Shows filename below the image

#### Enhanced Skills System
- **Create Skills Section** - New sidebar section for skill creation
  - Download Template button - Downloads SKILL_TEMPLATE.md
  - Create New Skill button - Opens interactive skill creation modal
- **Skills Library Section** - Renamed and reorganized skills browsing
- **Skill Creation Modal** - Full-featured interface for creating skills
  - Skill name, description, author fields
  - Full template editor with syntax highlighting
  - Live metadata replacement
  - Automatic file download with proper naming

#### Sidebar Navigation Improvements
- **Nav Title Components** - Consistent section headers with icons
  - Chat History (clock icon)
  - Create Skills (layers icon)
  - Skills Library (book icon)
- **Visual organization** - Clear separation between different functional areas

### Fixed

#### JavaScript Syntax Errors
- **Fixed 9+ template literal escaping issues** - Changed `\`` to proper backticks
- **Fixed interpolation syntax** - Changed `\${...}` to `${...}`
- **Verified with node --check** - All JavaScript now passes syntax validation

### Changed

- **ARCHITECTURE.md** - Updated documentation to reflect new features
  - Added Image Preview Modal section
  - Added Enhanced Sidebar Navigation section
  - Updated class architecture diagrams
  - Updated data flow documentation

### Security

- **XSS Prevention** - All user content properly escaped
- **Content Security** - Images displayed as data URLs (no external requests)

### Fixed

#### GitHub Pages Build
- **Added `.nojekyll` file** - Disables Jekyll processing to prevent build failures
- **Restored all 38 skills** - BB_Skills repository files in folder structure
- **Skills folder structure** - Each skill has its own folder with `SKILL.md` inside
- **Static file serving** - GitHub Pages now serves skills as static assets

### Added

#### Sidebar Button Styling
- **`.download-skills-template-btn`** - Custom styling for Download Template button
- **`.create-new-skills-btn`** - Custom styling for Create New Skill button  
- **`.view-skills-btn`** - Custom styling for View Skills button
- Consistent glassmorphism design with backdrop blur
- Hover effects with background transition
- Proper spacing and alignment for sidebar buttons

## [1.0.0] - 2025-03-18

### Initial Release

#### Core Features
- **Multi-Provider Support** - Ollama (local) and LiteLLM (cloud)
- **Streaming Responses** - Real-time token-by-token display
- **File Attachments** - Support for text files and images
- **Chat Management** - Multiple concurrent chats with persistent history
- **Web Search Integration** - DuckDuckGo + Wikipedia search
- **Voice Input** - Web Speech API integration
- **Reasoning Blocks** - Collapsible thinking blocks for reasoning models
- **Skills System** - 100+ skills from BB_Skills repository

#### UI/UX
- **Responsive Design** - Mobile and desktop optimized
- **Dark Theme** - Consistent dark UI with orange accents
- **Animated Avatar** - Canvas-based AI avatar with eye-tracking
- **Starfield Background** - Animated particle background
- **Syntax Highlighting** - Code blocks with highlight.js

#### Files
- `index.html` - Main application (SPA)
- `404.html` - Custom 404 error page
- `fonts.css` - Custom font definitions
- `sw.js` - Service Worker for PWA support
- `ARCHITECTURE.md` - Architecture documentation
- `CNAME` - Custom domain configuration
- `skills/` - 100+ skill files from BB_Skills

---

## Protected Files

The following files are essential and must not be removed:

- **CNAME** - Custom domain configuration for GitHub Pages
- **404.html** - Custom error page for the application
- **.nojekyll** - Disables Jekyll processing (required for skills to work)
