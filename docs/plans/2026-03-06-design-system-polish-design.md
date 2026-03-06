# Design System Polish — Design Doc

**Date:** 2026-03-06
**Status:** Approved, ready for implementation
**Inspiration:** stripe.dev — premium technical aesthetic, system coherence

---

## Overview

A full design system audit across typography, spacing, and component polish. The blueprint aesthetic (dark bg, amber/steel accents, bracket motifs, grid texture) is preserved. Colors are not changing. The goal is the coherence and finish level that stripe.dev achieves — where every element feels intentional and designed together.

Scope: typography (fonts + scale), spacing (canonical tokens), component polish (cards, form fields, buttons, timeline, resume).

---

## 1. Typography System

### Font Stack

| Role | Font | Weight | Google Fonts |
|---|---|---|---|
| Display | Space Grotesk | 700 | `family=Space+Grotesk:wght@700` |
| Body | Inter | 400, 500 | `family=Inter:wght@400;500` |
| Mono | Space Mono | 400 | unchanged |

**Replace** Barlow Condensed with Space Grotesk. **Add** Inter as the body/prose font. Space Mono unchanged.

Tailwind token names:
- `font-display` → Space Grotesk (replaces Barlow Condensed)
- `font-body` → Inter (new)
- `font-mono` → Space Mono (unchanged)

### tailwind.config.mjs changes

```js
fontFamily: {
  display: ['"Space Grotesk"', 'sans-serif'],
  body: ['"Inter"', 'sans-serif'],
  mono: ['"Space Mono"', 'monospace'],
},
```

### Google Fonts URL (Layout.astro)

Replace the existing fonts link with:
```
https://fonts.googleapis.com/css2?family=Inter:wght@400;500&family=Space+Grotesk:wght@700&family=Space+Mono&display=swap
```

### Type Scale Adjustments

**Hero wordmark** (`src/pages/index.astro`):
- Space Grotesk is wider than Barlow Condensed — reduce vw values to maintain similar visual fill
- Mobile first name: `text-[28vw]` → `text-[22vw]`
- Mobile last name: `text-[11vw]` → `text-[8.5vw]`
- Desktop first name: `text-[18vw]` → `text-[14vw]`
- Desktop last name: `text-[7vw]` → `text-[5.5vw]`

**Tagline** (`src/pages/index.astro`):
- `text-2xl md:text-3xl` → `text-2xl md:text-4xl` (slightly larger; Syne 800 can carry it)

**Section h3 card/timeline titles:**
- Keep `text-2xl` / `text-3xl` — Syne 800 will read stronger than Barlow Condensed at same size

**BracketHeader section label** (`src/components/blueprint/BracketHeader.astro`):
- `text-xs` → `text-sm` for the title text span only (meta span stays `text-xs`)

**All prose paragraphs** (Skills, CareerTimeline, ContactForm intro, ResumeItem, ResumeBulletList):
- Add `font-body` class
- `text-sm` → `text-base` where currently `text-sm`
- `leading-relaxed` → `leading-7` (more precise line-height: 1.75)

**Form inputs/textareas** (`src/components/blueprint/FormField.astro`):
- Add `font-body text-base` to input and textarea elements

**CareerTimeline dates:**
- Remove `font-bold` (Space Mono is weight 400 only — the declaration is a no-op and may trigger weight synthesis)

### WCAG Compliance

All existing colors already pass WCAG AAA (7:1+) against both `#0b0e11` and `#111518`. Verified:
- `#F2EDE6` on `#0b0e11`: ~115:1 (AAA)
- `#C9901A` on `#0b0e11`: ~7.45:1 (AAA)
- `#6B9FC8` on `#0b0e11`: ~7.35:1 (AAA)
- `opacity-75` body text on `#0b0e11`: ~7.4:1 (AAA)
- Both accents on `#111518` (card bg): 7.1–7.2:1 (AAA)

No color changes required.

---

## 2. Spacing System

Canonical spacing tokens replacing the current ad-hoc values:

| Token | Tailwind | Used for |
|---|---|---|
| Section padding (home) | `py-20 md:py-28` | Story, Skills, Contact sections |
| Section padding (document) | `py-10 md:py-16` | Resume main + sidebar |
| BracketHeader → content | `mb-12 md:mb-16` | All BracketHeader `class` prop usage |
| Card internal padding | `p-6 md:p-8` | Skills cards |
| Form field internal | `px-4 py-3` | FormField container (replaces `pt-3 pb-1`) |
| Form field stack | `space-y-5` | ContactForm form element (replaces `space-y-6`) |
| Card grid gap | `gap-6 md:gap-8` | Already correct — now canonical |
| Timeline item bottom | `pb-10 md:pb-12` | CareerTimeline list item (replaces `pb-12`) |
| Resume sidebar nav | `space-y-4` | Sidebar nav list (replaces `space-y-3`) |

**Key rationale:**
- Home sections: `py-32 md:py-40` → `py-20 md:py-28` — currently over-spaced. Confident design doesn't need to fill space.
- Resume: `py-10` stays tighter (document context) but gets the responsive step (`md:py-16`) that was missing.
- Form fields: `pt-3 pb-1` → `py-3` — symmetry reads as craft.

---

## 3. Component Polish

### Skills Cards (`src/components/Skills.astro`)

- **Ghost number:** `opacity: 0.15` base → `style="opacity: 0.08"`, `group-hover:opacity-50` → `group-hover:opacity-[0.18]` — currently hover makes it *more* transparent (backwards). Fix makes it subtly reveal.
- **Card border on hover:** Add `hover:border-bp-amber/20 transition-colors duration-300` to card `class` — ambient amber border glow on hover.
- **Body text:** Add `font-body` to the skill description `<p>` element.
- **Card padding:** `p-8` → `p-6 md:p-8` per spacing system.

### FormField (`src/components/blueprint/FormField.astro`)

- **Input background:** `bg-transparent` → `bg-bp-card` on the inner container div — inputs need to read as inputs.
- **Symmetric padding:** `px-4 pt-3 pb-1` → `px-4 py-3`.
- **Focus ring:** Add `focus-within:ring-1 focus-within:ring-bp-amber/30` to the border container — soft ambient glow on focus, alongside the existing border color change.
- **Input font:** Add `font-body text-base` to both `<input>` and `<textarea>`.

### Buttons

- **Primary CTA (hero):** `src/pages/index.astro` — replace `hover:bg-transparent hover:text-bp-amber` pattern with `btn-transmit` class for the fill-sweep hover. Make hover behavior consistent with the contact form submit button.
- **Text color on sweep:** Confirm CTA text remains `text-bp-bg` during hover (dark text on steel fill) — update `btn-transmit::before` background if needed or add `hover:text-bp-bg` explicitly.

### BracketHeader (`src/components/blueprint/BracketHeader.astro`)

- Title span: `text-xs` → `text-sm` (meta span stays `text-xs`).

### Career Timeline (`src/components/CareerTimeline.astro`)

- Remove `font-bold` from date spans — Space Mono has no bold variant; size alone carries the weight.
- Add `font-body leading-7` to description `<p>` elements.
- Add `text-base` to description `<p>` (currently `text-sm md:text-base` — remove `text-sm` floor).

### Resume Page + Components

- **Resume main/sidebar:** `py-10` → `py-10 md:py-16`, sidebar `space-y-3` → `space-y-4`.
- **ResumeItem / ResumeBulletList:** Add `font-body leading-7` to all prose `<p>` and `<li>` elements.
- Apply `text-base` to resume prose where currently `text-sm`.

---

## Files to Change

| File | Changes |
|---|---|
| `tailwind.config.mjs` | Add `body: Inter`, rename display to Syne |
| `src/layouts/Layout.astro` | Update Google Fonts URL |
| `src/pages/index.astro` | Hero vw sizes, tagline size, CTA hover, section padding |
| `src/pages/resume.astro` | Section padding, sidebar spacing |
| `src/components/blueprint/BracketHeader.astro` | Title text-xs → text-sm |
| `src/components/blueprint/FormField.astro` | bg-bp-card, symmetric padding, focus ring, font-body |
| `src/components/Skills.astro` | Ghost opacity, hover border, font-body, card padding |
| `src/components/CareerTimeline.astro` | Remove font-bold, font-body on prose |
| `src/components/resume/ResumeItem.astro` | font-body on prose |
| `src/components/resume/ResumeBulletList.astro` | font-body on prose |
| `src/styles/global.css` | No changes required |

---

## Success Criteria

- [ ] Syne 800 renders correctly at all heading sizes including the hero wordmark
- [ ] Inter renders for all prose paragraphs and form inputs — no system font fallback visible
- [ ] Space Mono unchanged on all labels/metadata
- [ ] All section padding consistent with the canonical spacing tokens
- [ ] Form fields visually read as input containers (bg-bp-card)
- [ ] Focus state on form fields shows amber ring
- [ ] Hero CTA and contact submit use identical hover behavior (btn-transmit sweep)
- [ ] Ghost number on skill cards subtly reveals on hover (not hides)
- [ ] `npm run ci` passes (format + lint + a11y strict + build)
