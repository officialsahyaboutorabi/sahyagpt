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

#### Phase 1: Setup & Structure
- [ ] Create `imagine.html` with base structure
- [ ] Create `js/imagine.js` with core logic
- [ ] Create `css/imagine.css` with styles
- [ ] Add "Imagine" to sidebar navigation

#### Phase 2: UI Implementation
- [ ] Mode toggle (Image/Video)
- [ ] Aspect ratio selector
- [ ] Prompt input component
- [ ] Image upload for video mode
- [ ] Generate button

#### Phase 3: API Integration
- [ ] HuggingFace API client
- [ ] Image generation endpoint
- [ ] Video generation endpoint
- [ ] Error handling

#### Phase 4: Results & Actions
- [ ] Results gallery display
- [ ] Save/download functionality
- [ ] Upscale option
- [ ] Redo/Regenerate option
- [ ] Progress indication

#### Phase 5: Integration
- [ ] Link from main app sidebar
- [ ] Settings integration for API key
- [ ] Consistent navigation

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
