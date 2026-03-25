# Design System Document

## 1. Overview & Creative North Star

### Creative North Star: "The Neural Void"

This design system is envisioned as an immersive, high-end AI interface that prioritizes focus and creative flow. It rejects cluttered, traditional web layouts in favor of a cinematic, dark-first experience. By combining a deep void-like background with high-energy orange accents and subtle ambient effects, we create a space that feels like a professional creative studio.

The system breaks standard web patterns through:

* **Intentional Void:** Utilizing a deep black background (`#0d0d0d`) that eliminates visual noise and keeps the user focused on the content.

* **Architectural Sidebar:** A fixed, glass-morphic navigation sidebar that provides persistent context without competing for attention.

* **Cinematic Accents:** Strategic use of vibrant orange (`#ff4f00`) for high-intent actions, creating visual hierarchy through color psychology.

* **Living Backgrounds:** Subtle animated elements (starfield, gradient overlays, video backgrounds) that add depth without distraction.

---

## 2. Colors

The color palette is anchored in deep blacks and high-energy oranges, designed to make content "pop" against a zero-distraction void.

### The Foundation

* **Background Primary (`--bg-primary: #0d0d0d`):** The primary void. All creative work begins here.

* **Background Secondary (`--bg-secondary: #121212`):** Slightly elevated surfaces for cards and containers.

* **Background Card (`--bg-card: #171717`):** Card surfaces and input backgrounds.

* **Background Hover (`--bg-hover: #1f1f1f`):** Interactive hover states.

* **Accent (`--accent: #ff4f00`):** The signature orange accent. Use this sparingly for:
  - Primary buttons
  - Active navigation states
  - Category tags
  - Interactive highlights

* **Accent Glow (`--accent-glow: rgba(255, 107, 44, 0.1)`):** Subtle orange glow for hover effects and ambient lighting.

* **Success (`--success: #00ff88`):** Positive actions, online indicators, copied states.

* **Error (`--error: #ff3333`):** Destructive actions, errors, warnings.

* **Border (`--border: #2a2a2a`):** Subtle structural boundaries.

* **Text Primary (`--text-primary: #fbfbfb`):** Headlines, important text. Almost-white for maximum contrast.

* **Text Secondary (`--text-secondary: #b7b7b7`):** Body text, descriptions, muted content.

### The "Glass & Blur" Rule

Floating UI elements (modals, dropdowns, sidebar) must utilize glassmorphism:

* **Recipe:** `background: rgba(18, 18, 18, 0.85)` + `backdrop-filter: blur(20px)`
* **Example:** The sidebar uses this effect to create depth while maintaining context with the background.

### Ambient Gradients

Hero sections and featured areas use radial gradients for depth:
* **Recipe:** `radial-gradient(ellipse at center, rgba(255, 79, 0, 0.15) 0%, transparent 70%)`
* **Usage:** Hero section backgrounds, category card hover states.

---

## 3. Typography

The system employs SB Sans Text as the primary typeface for its modern, technical feel and excellent readability.

* **Primary Font:** `'SB Sans Text', -apple-system, BlinkMacSystemFont, sans-serif`

* **Weights:**
  - Regular (400) for body text
  - Semibold (600) for navigation, labels, emphasis
  - Bold (700) for headlines, logos

* **Scale:**
  - `display-lg` (clamp 2.5rem - 4.5rem): Hero headlines
  - `headline-md` (1.5rem): Section titles, card headers
  - `headline-sm` (1.25rem): Page titles in header
  - `body-lg` (1.1rem): Search inputs, prominent text
  - `body-md` (0.95rem): Navigation items, body text
  - `body-sm` (0.85rem): Labels, metadata, counts
  - `label-xs` (0.75rem): Tags, small labels

### Typography Patterns

* **Hero Headlines:** Use split-color treatment with `.word1/.word2/.word3` classes for gradient/accent emphasis.
* **Navigation:** Uppercase section titles with `0.5px` letter-spacing.
* **Hierarchy:** Text secondary (`#b7b7b7`) for body, text primary (`#fbfbfb`) for emphasis.

---

## 4. Elevation & Depth

In this system, depth is achieved through tonal transitions, glass effects, and strategic layering.

### The Layering Principle

Hierarchy is created through background color shifts:

1. **Deepest Layer:** `bg-primary` (`#0d0d0d`) - Page background
2. **Surface Layer:** `bg-secondary` (`#121212`) - Sidebar, containers
3. **Card Layer:** `bg-card` (`#171717`) - Cards, inputs
4. **Elevated Layer:** `bg-hover` (`#1f1f1f`) - Hover states

### Glassmorphism Components

* **Sidebar:** `rgba(18, 18, 18, 0.85)` + `backdrop-filter: blur(20px)` + `border-right: 1px solid var(--border)`
* **Modals:** `rgba(23, 23, 23, 0.9)` + `backdrop-filter: blur(10px)` + `border: 1px solid var(--border)`
* **Dropdowns:** `rgba(23, 23, 23, 0.9)` + `backdrop-filter: blur(10px)`

### Structural Definition

* **No Hard Borders:** Use background color shifts instead of borders for separation.
* **Accent Borders:** When borders are necessary, use `var(--border)` (`#2a2a2a`) for subtle definition.
* **Active Indicators:** Left border accent (`3px` wide, `var(--accent)`) for active navigation items.

---

## 5. Components

### The Sidebar (Navigation Hub)

A fixed, 280px wide glassmorphic panel on the left.

* **Structure:**
  - Header: Logo and branding
  - Navigation Section: Primary links (Chat, Imagine, PromptHub)
  - Footer: Settings/actions

* **Navigation Items:**
  - Default: `text-secondary` with hover transition
  - Active: `text-primary` + `background: rgba(255, 79, 0, 0.1)` + left accent border
  - Hover: Background tint transition

* **Logo:** `36px` rounded square with `SG` monogram, `bg-accent` background.

### The Header

A sticky, 60px high bar sitting at the top of the main content.

* **Structure:**
  - Left: Menu toggle, page title/dropdowns
  - Center: Search (optional, desktop only)
  - Right: Language selector, action buttons, status indicators

* **Style:** `bg-primary` + subtle bottom border + `backdrop-filter: blur(20px)`

### Category Cards

Circular icon cards for category selection.

* **Size:** `140px × 160px` (desktop), responsive on mobile
* **Layout:** 4-column grid on desktop, 2-column on mobile
* **States:**
  - Default: `bg-card` + border
  - Hover: `translateY(-4px)` + orange glow shadow + border color change
  - Active: Border color `accent` + subtle orange background tint
* **Icon Container:** `56px` rounded square, `bg-hover` background

### Prompt Cards

Content cards for displaying prompts.

* **Structure:** Category tag, title, text preview, stats footer
* **Style:** `bg-card` + border, `16px` border radius
* **Hover:** Top gradient accent line reveals, card lifts slightly
* **Top Accent:** Animated gradient line (`linear-gradient(90deg, var(--accent), #ff8c5a)`)

### Buttons

**Primary Button (.header-btn):**
* `bg-accent` + no border
* `border-radius: 10px`
* White text, semibold
* Hover: Lighter orange + subtle lift + shadow

**Secondary/Ghost Button:**
* Transparent background + border
* `text-secondary`
* Hover: `bg-hover` + `text-primary`

**Icon Button (.menu-toggle):**
* `40px × 40px` square
* Transparent background
* Hover: Subtle background tint

### Search Inputs

* **Style:** `bg-card` + border, `12-16px` border radius
* **Focus:** Border color changes to `accent` + subtle orange glow
* **Icon:** Positioned absolute inside input

### Dropdowns

* **Trigger:** Flex layout with icon, text, and chevron
* **Menu:** Glass effect + `10px` border radius
* **Items:** `text-secondary` → `text-primary` on hover
* **Selected:** `bg-selected` background

---

## 6. Spacing & Layout

### Spacing Scale

* `--spacing-1:` `4px`
* `--spacing-2:` `8px`
* `--spacing-3:` `12px`
* `--spacing-4:` `16px`
* `--spacing-5:` `20px`
* `--spacing-6:` `24px`
* `--spacing-8:` `32px`
* `--spacing-10:` `40px`
* `--spacing-12:` `48px`
* `--spacing-16:` `64px`
* `--spacing-20:` `80px`

### Layout Patterns

* **Sidebar Width:** `280px` fixed
* **Main Content:** `margin-left: var(--sidebar-width)`
* **Container Max-Width:** `1200px` for content sections
* **Section Padding:** `32px` horizontal, `40-60px` vertical
* **Card Gaps:** `16-20px`

### Responsive Breakpoints

* **Desktop (>1024px):** Full sidebar, 4-column grids
* **Tablet (768-1024px):** Adjusted spacing, maintained layout
* **Mobile (<768px):** 
  - Collapsible sidebar (off-canvas)
  - Hidden search bar
  - 2-column grids
  - Stacked layouts

---

## 7. Motion & Animation

### Transitions

* **Default:** `all 0.2s ease` for interactive elements
* **Smooth:** `all 0.3s cubic-bezier(0.16, 1, 0.3, 1)` for layout changes
* **Slow:** `opacity 1.2s ease-in` for background fades

### Micro-interactions

* **Button Hover:** `transform: translateY(-1px)` + shadow increase
* **Card Hover:** `transform: translateY(-4px)` + border/glow changes
* **Nav Active:** Left border scale animation `transform: scaleY(0) → scaleY(1)`
* **Dropdown:** Translate + scale + fade (`translateY(-10px) scale(0.95) → translateY(0) scale(1)`)

### Background Animations

* **Gradient Canvas:** Flowing radial gradient animation (`requestAnimationFrame`)
* **Video Background:** Fixed position, autoplay, loop, muted
* **Noise Overlay:** Fixed SVG noise texture at 3% opacity

---

## 8. Do's and Don'ts

### Do

* **Do** use the deep void background (`#0d0d0d`) as the foundation.
* **Do** apply glassmorphism to floating UI elements for depth.
* **Do** use `accent` orange sparingly for maximum impact on CTAs and active states.
* **Do** maintain high contrast ratios for accessibility.
* **Do** use the `SB Sans Text` font family consistently.
* **Do** implement smooth transitions for all interactive elements.
* **Do** use grid layouts with consistent gaps (16-20px).

### Don't

* **Don't** use pure white (`#ffffff`) for text - use `text-primary` (`#fbfbfb`).
* **Don't** use harsh shadows - opt for subtle, diffused shadows or glows.
* **Don't** use bright, saturated colors outside the accent orange.
* **Don't** clutter the interface - prioritize white space.
* **Don't** use sharp 90-degree corners - use consistent border radius (10-20px).
* **Don't** make the sidebar compete with content - keep it subtle and glass-like.

---

## 9. Implementation Notes

### CSS Variables

```css
:root {
    --bg-primary: #0d0d0d;
    --bg-secondary: #121212;
    --bg-card: #171717;
    --bg-hover: #1f1f1f;
    --bg-selected: #1f1f1f;
    --text-primary: #fbfbfb;
    --text-secondary: #b7b7b7;
    --accent: #ff4f00;
    --accent-glow: rgba(255, 107, 44, .1);
    --success: #00ff88;
    --error: #ff3333;
    --border: #2a2a2a;
    --sidebar-width: 280px;
}
```

### Required Fonts

* **SB Sans Text:** Primary font (loaded from CDN)
* **Inter:** Fallback/system font

### Key Classes

* `.sidebar` - Fixed navigation sidebar
* `.main-content` - Main content area with left margin
* `.nav-item` - Navigation links
* `.category-card` - Category selection cards
* `.prompt-card` - Prompt display cards
* `.glass` - Glassmorphism effect base class
* `.header-btn` - Primary action buttons
