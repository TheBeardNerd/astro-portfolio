# Novel Interactions — Design Document
**Subject:** Travis Windsor-Cummings Portfolio
**Date:** 2026-03-07
**Status:** APPROVED
**Scope:** Four interactive/generative additions to the approved Blueprint redesign
**Reference:** `docs/plans/2026-02-27-blueprint-redesign-design.md`

---

## Overview

Four additions layered onto the approved Blueprint design. Each is independently implementable. Together they achieve two goals: one signature interactive moment (the canvas drafting hand), and increased experiential depth across the rest of the page.

| Addition | Section | Technology |
|---|---|---|
| Canvas Drafting Hand | Hero | Canvas API, `requestAnimationFrame` |
| SVG Schematic Watermarks | Skills cards | Inline SVG |
| ECG Timeline Pulse | Build Log | SVG `<path>`, `stroke-dashoffset` |
| Live Telemetry Panel | Fixed, desktop | Vanilla JS, `setInterval` |

---

## 1. Canvas Drafting Hand (Hero)

### Concept
A `<canvas>` element sits full-width behind the hero content, z-indexed below all text. It renders two concurrent behaviors: cursor trace paths and a grid cell glow field. Together they make the hero feel like a live working document — as if an invisible hand is drafting on the blueprint in real time.

### Canvas Setup
- Full-width, full-height of the hero section
- `position: absolute`, `inset: 0`, `z-index: 0`
- Hero content sits on top at `z-index: 1`
- Canvas resizes on `ResizeObserver` — redraws grid cell map on resize

### Cursor Trace Paths
On `mousemove` over the hero:
- Record cursor `[x, y]` positions into a rolling buffer
- Each frame, draw connected line segments between recent positions
- Style: `1px` stroke, `#C9901A` amber, `globalAlpha` decays from `0.6` to `0` over `1.8s` per segment
- Fast movement produces long sweeping arcs; slow movement produces tight precise marks
- Rendering stops when cursor leaves the hero (`mouseleave`)
- Each segment is stored with a `timestamp`; segments older than `1.8s` are culled from the buffer each frame

### Grid Cell Glow
The hero's `40px` engineering grid is mirrored as a cell map on the canvas:
- On each frame, compute which grid intersections fall within `100px` of the cursor
- Fill the surrounding `40x40` cell with `rgba(201, 144, 26, opacity)` where opacity is `0.04–0.07`, falling off with distance (linear interpolation: full at `0px`, zero at `100px`)
- Multiple cells glow simultaneously; the glow field travels fluidly with cursor movement
- This layer is drawn first (beneath the trace paths) each frame

### Mobile Fallback
No `mousemove` available. Instead:
- A single autonomous trace path drifts across the hero on a Lissajous curve
- Period: ~20 seconds per loop
- Opacity: max `0.2` (half of desktop) — suggests activity without demanding attention
- Grid glow follows the autonomous point using the same distance calculation

### `prefers-reduced-motion`
- Canvas element hidden via CSS: `@media (prefers-reduced-motion: reduce) { canvas { display: none; } }`
- The existing CSS `repeating-linear-gradient` background grid remains visible and static
- No JS animation loop runs

### Implementation Notes
- Single `requestAnimationFrame` loop for the entire canvas — traces + glow in one pass
- Loop starts on first `mousemove` (desktop) or on `DOMContentLoaded` (mobile)
- Canvas is implemented as a standalone `Cursor.astro`-style component: `HeroDraftingCanvas.astro`
- Included inside the hero section in `src/pages/index.astro`

---

## 2. SVG Schematic Watermarks (Skills Cards)

### Concept
The `01`–`04` Space Mono number watermarks in each skill card are replaced with unique inline SVG circuit schematic symbols. The symbolism is ambient — it reads as authentic technical vocabulary without requiring explanation.

### Symbols
| Card | Symbol | SVG Elements |
|---|---|---|
| 01 | Resistor — zigzag line | `<polyline>` with zigzag points |
| 02 | Capacitor — two parallel vertical plates | Two `<line>` elements |
| 03 | AND logic gate — D-shape | `<path>` flat left, curved right |
| 04 | Ground — three descending horizontal bars | Three `<line>` elements, decreasing width |

### Styling
- `~90px` wide, `viewBox` sized per symbol
- `fill: none`, `stroke: #C9901A`, `stroke-width: 1.5`
- `opacity: 0.18` at rest
- `position: absolute`, bottom-right corner of card (inside padding)
- Not centered — offset `1rem` from bottom-right edges

### Hover State
- On card hover: opacity `0.18 → 0.32`, `150ms ease-out`
- Matches existing corner-tick extension animation — same trigger, same timing
- Implemented via CSS group hover (Tailwind `group-hover:` or equivalent CSS class)

### Implementation Notes
- Each symbol is inline SVG directly inside the skill card markup
- 5–8 path/line elements per symbol — no external library, no image files
- The `BlueprintFrame.astro` corner-tick component already exists in the plan; SVG symbols sit alongside it inside each card

---

## 3. ECG Timeline Pulse (Build Log)

### Concept
The amber vertical margin line in the Build Log is rendered as an SVG `<path>` with a gentle sine-wave oscillation instead of a straight line. It reads as a signal trace, oscilloscope readout, or heartbeat — consistent with the blueprint-as-living-document concept. The wave implies motion even when the page is not scrolling.

### Geometry
- Amplitude: `±2px` from centerline (left-right)
- Wavelength: `40px` (one full cycle per grid square)
- The path follows the full height of the Build Log section
- Generated mathematically: points sampled every `5px` along the y-axis, x-offset calculated as `amplitude * Math.sin((y / wavelength) * 2 * Math.PI)`

### Animation
The sine path is static in shape — it does not animate in place. Instead:
- `stroke-dasharray` set to the full path length
- `stroke-dashoffset` starts at full length, animates to `0` as the section scrolls into view
- This is the same scroll-draw mechanic from the approved design, applied to a sinusoidal path instead of a straight line
- The wave is revealed progressively top-to-bottom as the user scrolls, as if being plotted in real time

### `prefers-reduced-motion`
- SVG path replaced with a straight `<line>` (same color, same scroll-draw reveal)
- No wave geometry rendered

### Implementation Notes
- SVG generated as a static inline element — path `d` attribute computed once on the server (Astro component) or as a small inline `<script>` on mount
- Replaces the current CSS `border-left` or `border` approach for the timeline rule
- Tick marks connecting each entry to the line remain as `<line>` elements perpendicular to the path

---

## 4. Live Telemetry Panel

### Concept
A small fixed data-block panel — desktop only, lower-left corner. It looks like it belongs on the drawing, not on top of it: a blueprint title-block annotation showing live system state.

### Visual Design
- `160px` wide, auto height
- `1px` steel border (`#1E2730`), background `#111518`, amber corner ticks (matching skill cards)
- No border-radius
- `position: fixed; bottom: 1.5rem; left: 1.5rem`
- Hidden below `lg` breakpoint (`display: none` on mobile)

### Content
```
// TELEMETRY ————————
LOC     MEMPHIS, TN
TIME    14:23:07 CST
SESSION 00:04:32
SCROLL  47%
```

- `// TELEMETRY` header: Space Mono `10px`, steel (`#6B9FC8`), tracking-widest
- Data rows: Space Mono `11px` — label in steel, value in warm white (`#F2EDE6`)
- `LOC` is static
- `TIME` is current Memphis time (America/Chicago timezone), updated every second
- `SESSION` counts up from `00:00:00` from page load, updated every second
- `SCROLL` is `Math.round((scrollY / (docHeight - viewportHeight)) * 100)`, updated on `scroll` event

### Behavior
- Panel fades in at `1500ms` after page load (`opacity: 0 → 1`, `400ms`) — after the hero sequence completes
- `TIME` and `SESSION` driven by a single shared `setInterval` at `1000ms`
- `SCROLL` updates on `scroll` event with no debounce (lightweight enough)
- `prefers-reduced-motion`: panel still renders and updates, but the fade-in is instant (`opacity: 1` immediately)

### Implementation Notes
- Implemented as `TelemetryPanel.astro` — a standalone component included in `Layout.astro` (renders on both pages)
- All JS is inline `<script>` within the component — no shared module needed
- Memphis timezone handled via `Intl.DateTimeFormat` with `timeZone: 'America/Chicago'`

---

## Accessibility

All four additions respect `prefers-reduced-motion` as documented per feature. No new interactive elements are introduced that require keyboard access (canvas is purely decorative, telemetry is read-only display, SVG symbols are decorative). ARIA roles:
- Canvas: `aria-hidden="true"`
- SVG schematic symbols: `aria-hidden="true"`
- ECG SVG path: `aria-hidden="true"`
- Telemetry panel: `aria-hidden="true"` (decorative ambient data, not meaningful to screen readers)

---

## Implementation Order (recommended)

1. SVG Schematic Watermarks — purely additive, no JS, lowest risk
2. ECG Timeline Pulse — SVG only, self-contained
3. Live Telemetry Panel — self-contained component, straightforward JS
4. Canvas Drafting Hand — most complex, implement last with full test on mobile + reduced-motion
