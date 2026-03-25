# Design System Document

## 1. Overview & Creative North Star

### Creative North Star: "The Neural Void"

This design system is envisioned as a high-end, focused AI interface where clarity meets creative energy. It rejects the cluttered, widget-heavy feel of traditional web apps in favor of a cinematic, immersive dark experience. By blending a deep, void-like primary background with high-octane orange accents and glassmorphic UI elements, we create a space that feels like a professional creative studio.

The system breaks standard web patterns through:

* **Intentional Depth:** Utilizing a tiered dark-mode hierarchy that mimics physical layers of glass and light.

* **Architectural Sidebar:** A fixed, glass-morphic navigation sidebar that provides persistent context without competing for attention.

* **Cinematic Contrast:** High-contrast dark surfaces with strategic orange accents that guide the eye to high-intent actions.

---

## 2. Colors

The color palette is anchored in deep blacks and high-energy oranges, designed to make content "pop" against a zero-distraction void.

### The Foundation

* **Background (`#0d0d0d`):** The primary void. All creative work begins here.

* **Primary (`#ff4f00`):** The signature orange accent. Use this sparingly for high-intent actions and active states.

* **Surface Hierarchy:**
  * `bg-secondary`: `#121212` (Used for the sidebar and elevated surfaces)
  * `bg-card`: `#171717` (Used for cards, inputs, and containers)
  * `bg-hover`: `#1f1f1f` (Used for active hover states and elevated chips)

### The "No-Line" Rule

Horizontal and vertical rules are strictly prohibited for sectioning. Structural definition must be achieved through background shifts. For example, the sidebar should be defined by its `bg-secondary` color sitting atop the `background`, or through a subtle `backdrop-blur` rather than a stroke.

### The "Glass & Gradient" Rule

Floating UI elements (like the sidebar, modals, or dropdowns) must utilize Glassmorphism.

* **Recipe:** `bg-secondary` at 85% opacity + `backdrop-filter: blur(20px)`.

* **CTAs:** Use the `primary` color (vibrant orange) for buttons to give them a three-dimensional, tactile energy.

---

## 3. Typography

The system employs SB Sans Text as the primary typeface for its modern, technical feel and excellent readability.

* **Display & Headlines (SB Sans Text):** A geometric sans-serif with a technical edge. Used for headers and page titles. Its clean proportions reflect the AI's precision.

* *Scale:* `display-lg` (clamp 2.5rem - 4.5rem) for hero statements; `headline-sm` (1.25rem) for page titles.

* **Body & Utility (SB Sans Text):** A high-readability sans-serif that acts as the workhorse for prompts, navigation, and metadata.

* *Scale:* `body-lg` (1.1rem) for input text; `label-sm` (0.85rem) for technical metadata and category tags.

**Hierarchy Note:** Always maintain a high contrast ratio. Use `text-primary` (almost white) for headlines and `text-secondary` (muted grey) for body text to guide the eye toward the most critical information first.

---

## 4. Elevation & Depth

In this system, depth is not a shadow; it is a tonal transition.

### The Layering Principle

Hierarchy is achieved by "stacking" surface tiers. To create a card:

1. **Base:** `bg-primary` (`#0d0d0d`).

2. **Card Body:** `bg-card` (`#171717`).

3. **Active Element:** `bg-hover` (`#1f1f1f`).

This creates a soft, natural lift that feels integrated into the dark theme.

### Ambient Shadows & "Ghost Borders"

* **Shadows:** When an element must float (e.g., category cards on hover), use a highly diffused shadow: `0 10px 40px rgba(255, 79, 0, 0.15)`. Never use a hard-edged shadow.

* **Ghost Borders:** If a boundary is required for accessibility, use a "Ghost Border": `border` color (`#2a2a2a`) at low prominence, or a left accent border (`3px` wide, `primary` color) for active navigation items.

---

## 5. Components

### The Sidebar (The Navigation Hub)

A fixed, 280px wide glass-morphic panel sitting on the left side of the viewport.

* **Container:** `bg-secondary` at 85% opacity + `backdrop-filter: blur(20px)` + `border-right: 1px solid border`.

* **Interaction:** On hover, navigation items transition from `text-secondary` to `text-primary`. Active items show a left accent border (`3px` wide, `primary` color).

* **Internal Layout:** Use `16px` padding. Navigation sections are separated by `8-16px` gaps.

### Buttons & Chips

* **Primary Button:** `primary` background with white text. Corner radius: `10px`.

* **Chips (Category Selection):** `bg-card` background with border. Icons should use `primary` color for the active state. Forbid divider lines between chips; use `16px` gaps.

### The Category Grid

Category cards are displayed in a 2x4 grid layout (4 on top, 4 on bottom).

* **Hover State:** Upon hovering over a card, it lifts (`translateY(-4px)`) and an orange glow shadow appears.

* **Rounding:** All cards utilize `20px` corner radius, with icon containers at `16px` to soften the grid.

### The Prompt Card Grid

Prompt cards displayed in a responsive grid layout.

* **Hover State:** Upon hovering, a gradient accent line (`linear-gradient(90deg, primary, #ff8c5a)`) reveals at the top, and the card lifts slightly.

* **Rounding:** All cards utilize `16px` corner radius.

### Input Fields

* **Style:** `bg-card` background + border. Use a `body-lg` font size.

* **Placeholder:** `text-secondary` at 50% opacity.

---

## 6. Do's and Don'ts

### Do

* **Do** use the interactive starfield/canvas background at a very low opacity (5-8%) to provide a sense of scale and "digital texture" to the primary background.

* **Do** prioritize white space. Let the content breathe by using `32px` padding around section edges.

* **Do** use `primary` (vibrant orange) for micro-interactions, such as the cursor blink or active navigation indicators, to maintain a high-energy feel.

### Don't

* **Don't** use pure white (`#ffffff`) for text. It creates "haloing" against the deep black background. Use `text-primary` (`#fbfbfb`) for better legibility and a premium feel.

* **Don't** use standard `1px solid` borders. If you need to separate content, use a background color shift or a vertical margin.

* **Don't** use sharp 90-degree corners. Everything from buttons to cards must use the defined roundedness (10-20px) to maintain the "Editorial" aesthetic.
