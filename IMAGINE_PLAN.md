# Imagine Page Implementation Plan

## Overview
Create a separate page for AI image and video generation at `/imagine.html`, styled like Grok's imagine interface but with SahyaGPT's dark theme.

## Research Summary

### Best Image Generation Models (2025)
| Model | Params | License | Speed | Best For |
|-------|--------|---------|-------|----------|
| **FLUX.1 [schnell]** | 12B | Apache 2.0 | 4 steps | Fast generation, commercial use |
| **Z-Image Turbo** | 6B | Apache 2.0 | 8 steps | Excellent text rendering |
| **Stable Diffusion 3.5** | 8B | Community | 28-50 steps | Professional use |
| **SDXL Lightning** | 6.6B | OpenRAIL++ | 4-8 steps | Low VRAM (12GB) |

### Best Video Generation Models (2025)
| Model | Params | License | Features | Best For |
|-------|--------|---------|----------|----------|
| **LTX Video** | 13B/2B | Apache 2.0 | 30fps, real-time | Fast prototyping |
| **Wan 2.2** | 14B | Open | MoE architecture | Cinema-quality |
| **HunyuanVideo** | 13B | Open | Text/Video tokens | General purpose |
| **CogVideoX-5B** | 5B | Open | 6s clips, 720x480 | Beginners |
| **Mochi 1** | 10B | Apache 2.0 | AsymmDiT | High-fidelity motion |

## Implementation Structure

### 1. New Files
```
sahyagpt/
├── imagine.html          # Main imagine page
├── js/
│   └── imagine.js        # Imagine page logic
├── css/
│   └── imagine.css       # Imagine page styles
```

### 2. Sidebar Integration
- Add "Imagine" nav item with provided icon
- Link to `/imagine.html`

### 3. Imagine Page Features

#### UI Components
- **Generation Mode Toggle**: Image | Video
- **Aspect Ratio Selector**: 2:3, 3:2, 1:1, 9:16, 16:9
- **Prompt Input**: Text area with style suggestions
- **Image Upload**: For image-to-video (up to 7 images)
- **Generation Button**: Start generation
- **Results Gallery**: Display generated content
- **Action Buttons**: Save, Upscale, Redo, Edit

#### Functional Requirements
- Generate up to 5 images at once
- Convert up to 7 images into video
- HuggingFace API integration
- Real-time progress indication
- Download generated content

### 4. HuggingFace Integration

#### API Endpoints
```javascript
// Image Generation
POST https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell
POST https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-3.5-large

// Video Generation  
POST https://api-inference.huggingface.co/models/Lightricks/LTX-Video
POST https://api-inference.huggingface.co/models/Wan-AI/Wan2.1-T2V-14B
```

#### Authentication
- User provides HuggingFace API token in settings
- Free tier: 1,000 requests/month
- Pro tier: Higher limits

### 5. Page Layout (Inspired by Grok)

```
+------------------------------------------+
|  Sidebar      |      Main Content        |
|               |                          |
|  Chat         |  +--------------------+  |
|  Imagine (active)| | Mode: [Image][Video]|  |
|  Create Skills|  +--------------------+  |
|  Skills Lib   |                          |
|               |  +--------------------+  |
|               |  | Aspect Ratio       |  |
|               |  | [2:3][3:2][1:1]...|  |
|               |  +--------------------+  |
|               |                          |
|               |  +--------------------+  |
|               |  | Prompt Input       |  |
|               |  | "Describe what..." |  |
|               |  +--------------------+  |
|               |                          |
|               |  [Generate Button]       |
|               |                          |
|               |  +--------------------+  |
|               |  | Results Gallery    |  |
|               |  | +----+ +----+ +----+ |  |
|               |  | |Img1| |Img2| |Img3| |  |
|               |  | +----+ +----+ +----+ |  |
|               |  +--------------------+  |
+------------------------------------------+
```

### 6. CSS Styling (SahyaGPT Theme)

```css
/* Colors */
--bg-primary: #0d0d0d;
--bg-secondary: #121212;
--bg-card: rgba(23, 23, 23, 0.9);
--text-primary: #fbfbfb;
--text-secondary: #b7b7b7;
--accent: #ff4f00;
--border: #2a2a2a;

/* Glassmorphism */
backdrop-filter: blur(10px);
background: rgba(23, 23, 23, 0.9);
border: 1px solid var(--border);
```

### 7. Execution Tasks

#### Phase 1: Setup & Structure ✅ COMPLETED
- [x] Create `imagine.html` with base structure
- [x] Add "Imagine" to sidebar navigation
- [x] Starfield background integration

#### Phase 2: UI Implementation ✅ COMPLETED
- [x] Mode toggle (Image/Video) with shimmer animation
- [x] Aspect ratio selector (2:3, 3:2, 1:1, 9:16, 16:9)
- [x] Chat-style prompt input component
- [x] Image upload for video mode
- [x] Generate button with loading states
- [x] Chat session view for generations
- [x] Masonry gallery (5-column Pinterest-style)

#### Phase 3: API Integration ✅ COMPLETED
- [x] Ollama API integration (primary provider)
  - [x] Dynamic model fetching
  - [x] Base64 image response handling
  - [x] Compatible model filtering
- [x] HuggingFace Endpoint support (optional)
- [x] Provider selection in settings
- [x] Error handling and fallbacks

#### Phase 4: Results & Actions ✅ COMPLETED
- [x] Masonry gallery display (5 columns)
- [x] Chat session view for active generations
- [x] Save/download functionality
- [x] Regenerate option
- [x] Real-time progress indication
- [x] History sidebar integration
- [x] Individual history deletion with trash button

#### Phase 5: Integration ✅ COMPLETED
- [x] Link from main app sidebar
- [x] Settings integration for providers
- [x] Consistent navigation with index.html
- [x] Translation support (en, ru)
- [x] Invisible scrollbars throughout

#### Phase 6: Persistence ✅ COMPLETED (v1.2.8)
- [x] IndexedDB integration for image storage
- [x] Images persist across page refreshes
- [x] Gallery shows user images after reload
- [x] Chat session displays images from IndexedDB
- [x] Dual storage strategy (localStorage + IndexedDB)

#### Phase 7: Code Quality & Security ✅ COMPLETED (v1.3.0)
- [x] Constants object for magic numbers
- [x] URL validation helpers
- [x] Ollama health check
- [x] Prompt sanitization (XSS prevention)
- [x] File size validation
- [x] Gallery size limits
- [x] Improved IndexedDB error handling

#### Phase 8: Gallery Personalization ✅ COMPLETED (v1.3.2)
- [x] Remove external demo images (Grok/xAI)
- [x] Gallery displays only user-generated content
- [x] Personalized empty state messaging

### 8. Architecture Changes (March 31, 2026)

#### Provider System
- **Primary**: Ollama (local) - No API key needed
- **Optional**: HuggingFace Endpoint - Self-hosted
- Removed: Puter AI, OpenRouter

#### Chat Session Pattern
Instead of simple results grid, imagine.html now uses:
- Conversation objects with messages array
- User message (prompt)
- Assistant message (generating → complete with image)
- Chat session view for real-time generation

#### Masonry Gallery Layout
- Absolute positioning for true masonry effect
- Items assigned by index % columnCount
- Dynamic column calculation (5→1 based on width)
- Smooth CSS transitions on resize
- 1px gaps between items

#### IndexedDB Image Storage (v1.2.8 - v1.3.0)
- **Problem**: localStorage quota (~5-10MB) too small for base64 images
- **Solution**: IndexedDB for persistent image storage
  - Database: `ImagineImagesDB`
  - Object store: `images` with schema `{ id, url, timestamp }`
  - Typical quota: 50MB+ (varies by browser)
  - Images persist across page refreshes
  - Gallery displays user creations after browser restart
- **Dual Storage Strategy**:
  - `chatHistory` in localStorage (metadata only, no image URLs)
  - `galleryImages` in localStorage (metadata, stripped URLs)
  - Actual image data in IndexedDB
  - In-memory `imageDataStore` Map for runtime caching
- **Methods**:
  - `initImageDB()` - Initialize on app start
  - `saveImageToDB(id, url)` - Persist after generation
  - `getImageFromDB(id)` - Retrieve for display
  - `loadAllImagesFromDB()` - Load all on gallery render
  - `deleteImageFromDB(id)` - Cleanup (future admin feature)

#### Error Handling Improvements (v1.2.8 - v1.3.0)
- **Robust Ollama response parsing** to handle server crashes
  - Read response as text before JSON parsing
  - Detect empty responses from server panics
  - Graceful handling of malformed JSON
  - User-friendly error messages suggesting to check server logs

## Technical Notes

### HuggingFace API Usage
```javascript
const response = await fetch(
    'https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell',
    {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inputs: prompt }),
    }
);
const blob = await response.blob();
```

### Image-to-Video Workflow
1. User uploads/selects 2-7 images
2. Images are sent to video model
3. Model generates video sequence
4. User can download or regenerate

### Security Considerations
- API key stored in localStorage (client-side only)
- No server required (pure client-side)
- Rate limiting handled by HuggingFace

## Timeline

1. **Hour 1**: Research, planning, file structure
2. **Hour 2-3**: UI implementation (HTML/CSS)
3. **Hour 4-5**: JavaScript logic & API integration
4. **Hour 6**: Testing, refinement, documentation
