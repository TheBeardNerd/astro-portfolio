# Blueprint Redesign — Design Document
**Subject:** Travis Windsor-Cummings Portfolio
**Date:** 2026-02-27
**Status:** APPROVED
**Concept:** Blueprint — Memphis warmth meets maker precision

---

## Concept

The site is designed as a living technical blueprint. The page looks like an engineering drawing that has been lived in — a working document, not a decorative one. Every design decision reinforces two identities simultaneously: Memphis soul (warmth, amber, grit) and maker precision (steel, grid, annotation). The blueprint aesthetic is established through texture, typography, annotation language, and motion — not decoration.

---

## 1. Visual Foundation

### Background
`#0b0e11` — near-black with a cool blue-steel cast. Feels like polished industrial concrete, not generic dark-mode gray.

### Grid Overlay
A barely-visible engineering-paper grid rendered via CSS `repeating-linear-gradient`. Two perpendicular lines at ~3% white opacity, `40px` spacing. Signature move — present when you look for it, invisible when you don't. Extends through the full page including nav and into skill cards.

```css
background-image:
  repeating-linear-gradient(rgba(255,255,255,0.03) 0 1px, transparent 1px 40px),
  repeating-linear-gradient(90deg, rgba(255,255,255,0.03) 0 1px, transparent 1px 40px);
background-size: 40px 40px;
```

### Color Palette
| Role | Value | Usage |
|---|---|---|
| Amber gold | `#C9901A` | Primary accent, emotional moments, Memphis warmth |
| Cool steel | `#6B9FC8` | Secondary UI, annotations, technical precision |
| Near-white warm | `#F2EDE6` | Body text — slightly warm to feel like paper on metal |
| Mid steel | `#1E2730` | Borders, dashed dividers, annotation lines |
| Dark card | `#111518` | Card/input backgrounds — slightly lighter than page |

### Typography
Two fonts only (down from four). Loaded via Google Fonts.

| Role | Font | Weight | Usage |
|---|---|---|---|
| Display | Barlow Condensed | 700 | All headings, nav links, hero name, button text |
| Mono | Space Mono | 400 | Annotations, dates, labels, technical copy, `// comments` |
| Body | — | — | System fallback stack for prose; or Barlow Condensed 400 |

No border-radius anywhere in the UI. Blueprint drawings have no rounded corners.

### Annotation Language
Consistent technical shorthand used throughout:
- `[ SECTION TITLE  ————————————————  KEY: VALUE ]` — full-width bracket headers
- `// LABEL` — field labels and annotations (double-slash comment syntax)
- `→` — amber arrow prefix for list items and link indicators
- Corner tick marks — four small `2px` amber L-shapes framing components

---

## 2. Hero

**Layout:** Full viewport height. Dark concrete + grid is visible immediately — no content yet, then elements render in sequence (see Motion section).

**Name treatment:** "TRAVIS" in Barlow Condensed 700, approximately `18vw`, left-aligned, sitting in the upper half of the viewport. Below it, Space Mono `11px` tracking-widest:
```
SOFTWARE ENGINEER — MEMPHIS GRIZZLIES — MEMPHIS, TN
```

**Blueprint annotations** (four elements in negative space):
1. Dashed amber horizontal line extending from name with label: `[ v2.0 ]`
2. Steel-blue crosshair marker upper-right with Memphis coordinates: `35°08'N 90°02'W`
3. Vertical dashed line with measurement bracket: `MEMPHIS, TN` + small arrow
4. Revision block lower-right (blueprint title block style):
   ```
   DRAWN BY    T. WINDSOR-CUMMINGS
   DATE        2026
   REV         CURRENT
   ```

**Headshot:** Photo placed inside a blueprint-style rectangular frame with amber corner tick marks. No circle, no ring, no border-radius. An amber annotation line extends from the frame with label: `SUBJECT`. Photo is full-color — blueprint elements frame it rather than filter it.

**CTA:** One primary action — amber-outlined button: `VIEW RECORD →` in Barlow Condensed. Secondary text link below revision block: `↓ scroll to begin` in small Space Mono.

---

## 3. Navigation

### Desktop
- Fixed header, `56px` tall
- Background: `rgba(11,14,17,0.85)` + `backdrop-filter: blur(8px)` — grid texture visible through it
- Left: "TWC" logotype in Barlow Condensed — drafter's stamp
- Right: Four links in Space Mono small caps `11px` tracking-widest: `STORY  SKILLS  RÉSUMÉ  CONTACT`
- Hover: Amber underline draws left-to-right (`width: 0 → 100%`, `200ms ease-out`). No background fills, no color shifts.
- Active page: Amber underline pre-drawn

### Mobile
- Hamburger icon: Two parallel horizontal bars (`=`) styled as a measurement indicator — not three bars
- Overlay: Full-screen dark concrete + grid texture (blueprint world, full-screen)
- Links: Barlow Condensed 700, large, left-aligned, preceded by steel annotation numbers: `01 —`, `02 —`, `03 —`, `04 —`
- Open animation: Links reveal via clip-path wipe (top to bottom), staggered `80ms` each
- Social links at bottom: Space Mono `12px`, amber

---

## 4. Story — Build Log

**Section header:**
```
[  BUILD LOG  ————————————————————————  SUBJECT: T. WINDSOR-CUMMINGS  ]
```

**Layout:** Two-column grid.
- Left column (~20% width): Date/year in Space Mono `4rem`, amber, left-aligned
- Right column (~80% width): Entry title + description + annotation tags
- A single thin amber vertical line runs down the left edge of the right column (the margin rule). Each entry connects with a perpendicular tick mark.

**Entry structure:**
```
2014 — 2019  |  Five Years on the Freight Yard
             |
             |  Hostler, Estes Express Lines. Moved trailers
             |  with precision and focus...
             |
             |  TYPE: PRE-TECH    DURATION: 5 YRS
```

**Color coding:**
- Pre-tech/personal milestones: amber date numbers
- Career/technical milestones: steel blue date numbers
- The color shift across the log visually narrates the life transition

**`TYPE` and `DURATION` tags:** Small Space Mono annotations at bottom of each entry. Blueprint data-tags — not decorative.

**Scroll animation:** The amber margin line draws downward via CSS `scroll-timeline` — `height` grows as the section scrolls into view. Each log entry clips in from top (`clip-path: inset(0 0 100% 0) → inset(0 0 0% 0)`), staggered `120ms` per entry.

---

## 5. Skills — Bill of Materials

**Section header:**
```
[  BILL OF MATERIALS  ————————————————  REV: CURRENT  QTY: 04  ]
```

**Layout:** 2×2 asymmetric grid.
- Top-left: flush top
- Top-right: offset down `2rem`
- Bottom-left: offset down further
- Bottom-right: comes back up
- Mobile: single column

**Each skill card:**
- Dark card background (`#111518`) with grid texture continuing inside
- `1px` steel border, no border-radius
- Amber blueprint corner tick marks (four L-shapes, `2px`)
- Large spec number in Space Mono `5rem`, amber, `opacity: 0.3` (watermark behind content): `01`, `02`, `03`, `04`
- Skill title in Barlow Condensed 700, `2rem`, full white — no icons
- Description in body text `#F2EDE6`
- Bottom annotation in Space Mono small, steel: `STATUS: ACTIVE — SINCE: [year]`

**Hover state:** Corner ticks extend outward `4px`, watermark opacity `0.3 → 0.5`, `150ms`.

**Scroll animation:** Cards clip in from outer edges simultaneously — top-left from left, top-right from right, bottom-left from left, bottom-right from right. `500ms`, staggered `80ms`.

---

## 6. Contact — Transmission Panel

**Section header:**
```
[  INITIATE CONTACT  ——————————————  METHOD: DIRECT  STATUS: OPEN  ]
```

**Form fields:**
- No border-radius
- `1px` steel border (`#1E2730`) at rest
- Amber blueprint corner tick marks matching skill cards
- Labels as Space Mono annotations: `// NAME`, `// EMAIL`, `// SUBJECT`, `// MESSAGE`
- Background: `#111518`
- Focus state: Corner ticks extend, border shifts to amber `#C9901A`, `200ms` transition

**Submit button:** Right-aligned (desktop), full-width (mobile). Barlow Condensed 700, uppercase: `TRANSMIT →`. Amber background, dark text. Hover: Steel-blue fill sweeps from right (`300ms`). No border-radius.

**Alternative Channels block** (below form, separated by thin dashed steel rule):
```
// ALTERNATIVE CHANNELS ————————————————————

GITHUB      → github.com/TheBeardNerd
LINKEDIN    → linkedin.com/in/traviswindsorcummings
TWITTER     → @TheBeardNerd
CODEPEN     → codepen.io/TravisWindsor-Cummings
```
Amber `→`, steel link text. Hover: arrow shifts right `4px`.

**Scroll animation:** Header draws left-to-right. Fields clip in staggered from left, `100ms` apart. Button + channels fade in last.

---

## 7. Motion & Interaction System

### Custom Cursor (desktop only)
- Amber registration mark: `8px` circle + four `6px` tick marks at 90° intervals
- Hover over interactive elements: circle scales to `28px`, ticks retract, `150ms ease-out`
- Position lag: `4px` lerp via `requestAnimationFrame` — physical weight without sluggishness
- Mobile: default cursor

### Page Load Sequence
| Time | Element | Animation |
|---|---|---|
| 0ms | Grid texture | `opacity: 0 → 1`, `400ms` |
| 200ms | "TRAVIS" name | `translateY(40px) → 0` + opacity, `500ms cubic-bezier(0.16,1,0.3,1)` |
| 500ms | Subtitle mono | Fade in, `300ms` |
| 700ms | Annotations | `clip-path` draw one by one, staggered `100ms` each |
| 1000ms | Headshot frame + photo | Ticks extend, photo fades in, `400ms` |
| 1200ms | CTA + revision block | Fade in, `300ms` |

### Scroll Reveals (IntersectionObserver, `threshold: 0.15`)
- **Section headers:** Full-width bracket line draws left-to-right via `clip-path`, `600ms`
- **Build Log margin line:** Grows via CSS `scroll-timeline`, tied directly to scroll position
- **Build Log entries:** Clip from top, staggered `120ms`
- **Skills cards:** Clip from outer edges, staggered `80ms`
- **Contact fields:** Clip from left, staggered `100ms`

### Page Navigation Transition
A thin amber `2px` horizontal bar sweeps left-to-right across the viewport on navigation (`400ms`), then the new page fades in beneath it. Vanilla JS + CSS only.

### Accessibility
`prefers-reduced-motion` media query collapses all keyframe animations and transitions to simple `opacity` fades. Custom cursor reverts to default. Full functionality preserved.

---

## 8. Résumé Page — Personnel File

**Page header:**
```
[  PERSONNEL FILE  ————————————————  SUBJECT: T. WINDSOR-CUMMINGS  ]
```

**Two-column layout:**
- Left sidebar (~220px, fixed on desktop): Blueprint table of contents
  ```
  CONTENTS ———————————

  → 01  EXPERIENCE
    02  EDUCATION
    03  CERTIFICATIONS
    04  PROJECTS
    05  COMMUNITY
  ```
  Active section: amber `→`. Inactive: steel. Updates via `IntersectionObserver` on scroll.
- Mobile: Sidebar collapses, section headers serve as anchors

**Section headers** (each résumé section):
```
[  EXPERIENCE  ——————————————————  ENTRIES: 04  ]
```

**Each entry:**
- Organization logo in blueprint corner-tick frame (amber ticks, `1px` steel border, no border-radius)
- Organization name: Barlow Condensed 700, `1.5rem`, white
- Role + date on same line: Space Mono, amber role / steel date, separated by long dash
- Bullets: `→` amber prefix, `#F2EDE6` body text
- Entry dividers: `border-top: 1px dashed #1E2730`

**Certifications / Projects:** Each entry in its own blueprint corner-tick frame (matching skills cards). Replaces current `border border-gray-200` which is out of system.

**Print styles:** `@media print` strips grid texture, sidebar, cursor, animations. Outputs clean black-on-white document. Bracket headers remain readable as plain text.

---

## 9. Footer

In-flow (not fixed). Replaces current fixed `z-0` footer.

```
[  TWC  ——————————————————————————  MEMPHIS, TN  ©2026  ]
```

Social links in Space Mono below the bracket line. No decorative border — the bracket is the only divider needed.

---

## Implementation Notes

- **Fonts to remove:** Overpass, Playfair Display, Palanquin Dark
- **Fonts to add:** Barlow Condensed 700, Space Mono 400
- **No border-radius** anywhere in UI components
- **No `border-gray-800` horizontal rules** — replaced with dashed steel lines or bracket headers
- **No section number clichés** (`01`, `02`) in the old inline style — numbers are structural elements (BOM spec numbers, Build Log dates) not decorative labels
- **Grid texture** applied at `body` level, extends everywhere
- **Custom cursor** implemented as a positioned `div` following mouse via JS
- All scroll animations use `IntersectionObserver` + CSS custom properties for timing
- `scroll-timeline` used for Build Log margin line (with `IntersectionObserver` fallback)
