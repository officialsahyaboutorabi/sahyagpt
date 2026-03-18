# Changelog

All notable changes to the SahyaGPT project will be documented in this file.

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
