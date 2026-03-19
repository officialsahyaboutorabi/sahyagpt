# Changelog

All notable changes to the SahyaGPT project will be documented in this file.

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
