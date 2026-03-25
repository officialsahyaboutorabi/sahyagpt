# Design System Document

## 1. Overview & Creative North Star

### Creative North Star: "The Neural Void"

This design system is envisioned as a high-end, focused AI interface where clarity meets creative energy. It rejects the cluttered, widget-heavy feel of traditional web apps in favor of a cinematic, immersive dark experience. By blending a deep, void-like primary background with high-octane orange accents and glassmorphic UI elements, we create a space that feels like a professional creative studio.

The system breaks standard web patterns through:

* **Intentional Void:** Utilizing a deep black background (`#0d0d0d`) that eliminates visual noise and keeps users focused on their AI interactions.

* **Architectural Sidebar:** A fixed, glass-morphic navigation sidebar that provides persistent context without competing for attention.

* **Cinematic Contrast:** High-contrast dark surfaces with strategic orange (`#ff4f00`) accents that guide the eye to high-intent actions.

* **Living Depth:** Subtle animated backgrounds (starfield, gradient overlays) that add spatial depth without distraction.

---

## 2. Colors

The color palette is anchored in deep blacks and high-energy oranges, designed to make content "pop" against a zero-distraction void.

### The Foundation

* **Background (`#0d0d0d`):** The primary void. All creative work begins here.

* **Primary (`#ff4f00`):** The signature orange accent. Use this sparingly for high-intent actions and active states.

* **Surface Hierarchy:**
  * `bg-secondary`: `#121212` (Sidebar, elevated surfaces)
  * `bg-card`: `#171717` (Cards, inputs, containers)
  * `bg-hover`: `#1f1f1f` (Hover states, elevated chips)

* **Text Colors:**
  * `text-primary`: `#fbfbfb` (Headlines, important text - almost white)
  * `text-secondary`: `#b7b7b7` (Body text, descriptions)

* **Status Colors:**
  * `success`: `#00ff88` (Positive indicators, copied states)
  * `error`: `#ff3333` (Errors, destructive actions)

### The "No-Line" Rule

Horizontal and vertical rules are strictly prohibited for sectioning. Structural definition must be achieved through background shifts. For example, the sidebar is defined by its `bg-secondary` color sitting atop the `bg-primary`, or through `backdrop-blur` rather than a stroke.

### The "Glass & Gradient" Rule

Floating UI elements (sidebar, modals, dropdowns) must utilize Glassmorphism.

* **Recipe:** `bg-secondary` at 85% opacity + `backdrop-filter: blur(20px)`.
* **CTAs:** Use `primary` (vibrant orange) for buttons to give them a three-dimensional, tactile energy.

---

## 3. Typography

The system employs SB Sans Text as the primary typeface for its modern, technical feel and excellent readability.

* **Display & Headlines (SB Sans Text):** A geometric sans-serif with a technical edge. Used for headers and page titles. Its clean proportions reflect the AI's precision.
  * *Scale:* `display-lg` (clamp 2.5rem - 4.5rem) for hero statements; `headline-sm` (1.25rem) for page titles.

* **Body & Utility (SB Sans Text):** The workhorse for prompts, navigation, and metadata.
  * *Scale:* `body-lg` (1.1rem) for search inputs; `body-md` (0.95rem) for navigation; `label-sm` (0.85rem) for tags and metadata.

**Hierarchy Note:** Always maintain a high contrast ratio. Use `text-primary` (almost white) for headlines and `text-secondary` (muted grey) for body text to guide the eye toward the most critical information first.

---

## 4. Elevation & Depth

In this system, depth is not a shadow; it is a tonal transition.

### The Layering Principle

Hierarchy is achieved by "stacking" surface tiers. To create a card:

1. **Base:** `bg-primary` (`#0d0d0d`)
2. **Card Body:** `bg-card` (`#171717`)
3. **Hover Element:** `bg-hover` (`#1f1f1f`)

This creates a soft, natural lift that feels integrated into the dark theme.

### Ambient Shadows & "Ghost Borders"

* **Shadows:** When an element must float (e.g., category cards on hover), use a highly diffused shadow: `0 10px 40px rgba(255, 79, 0, 0.15)`. Never use a hard-edged shadow.
* **Ghost Borders:** If a boundary is required, use the `border` color (`#2a2a2a`) at low prominence, or a subtle left accent border (`3px` wide, `primary` color) for active states.

---

## 5. Components

### The Sidebar (Navigation Hub)

A fixed, 280px wide glass-morphic panel on the left of the viewport.

* **Container:** `bg-secondary` at 85% opacity + `backdrop-filter: blur(20px)` + `border-right: 1px solid border`.
* **Interaction:** Navigation items transition from `text-secondary` to `text-primary` on hover, with active items showing a left accent border (`primary` color).
* **Internal Layout:** Use `16px` padding. Navigation sections are separated by `8-16px` gaps.

### Buttons & Chips

* **Primary Button:** `primary` background with white text. Corner radius: `10px`.
* **Secondary/Ghost Button:** Transparent background + `border` color. Hover to `bg-hover`.
* **Icon Button (Menu Toggle):** `40px` square, transparent background, hover to subtle background tint.

### The Category Grid

Category cards displayed in a 4-column grid (2x4 layout).

* **Card Size:** `140px × 160px` with `16px` gaps.
* **Hover State:** `translateY(-4px)` + orange glow shadow + border color change to `primary`.
* **Rounding:** `20px` corner radius for cards, `16px` for icon containers.

### The Prompt Card Grid

Prompt cards displayed in a responsive grid.

* **Card Style:** `bg-card` background + border, `16px` border radius.
* **Hover State:** Top gradient accent line reveals (`linear-gradient(90deg, primary, #ff8c5a)`), card lifts slightly.
* **Structure:** Category tag, title, text preview, stats footer with copy button.

### Input Fields

* **Style:** `bg-card` background + border, `12-16px` border radius.
* **Placeholder:** `text-secondary` at 50% opacity.
* **Focus:** Border color transitions to `primary` with subtle orange glow.

---

## 6. Do's and Don'ts

### Do

* **Do** use the interactive starfield/canvas background at very low opacity to provide a sense of scale and "digital texture" to the primary background.
* **Do** prioritize white space. Let the content breathe by using `32px` padding around section edges.
* **Do** use `primary` (vibrant orange) for micro-interactions, such as active navigation indicators and hover states, to maintain a high-energy feel.
* **Do** apply glassmorphism to the sidebar and modals for depth.

### Don't

* **Don't** use pure white (`#ffffff`) for text. It creates "haloing" against the deep black background. Use `text-primary` (`#fbfbfb`) for better legibility and a premium feel.
* **Don't** use standard `1px solid` borders for sectioning. If you need to separate content, use a background color shift or vertical margin.
* **Don't** use sharp 90-degree corners. Everything from buttons to cards must use rounded corners (10-20px radius) to maintain the "Editorial" aesthetic.
* **Don't** clutter the interface with too many accent colors. Stick to the orange `primary` for all interactive highlights.
