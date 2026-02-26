# Refactor Plan: `astro-portfolio`

## Scope and Constraints

- **No code changes are performed in this pass.**
- This document is a **surgical refactor blueprint** for readability, maintainability, and runtime efficiency.
- Recommendations are ordered for **safety first** (low risk, high confidence) and staged to avoid regressions.

---

## Executive Summary

The project is clean, small, and production-viable, but it carries concentrated technical debt in three areas:

1. **Monolithic markup and duplicated utility classes** (especially `src/pages/resume.astro`) reduce readability and make edits error-prone.
2. **Mixed concerns and hardcoded content/metadata** in layout and page components make consistency difficult (domain inconsistency already present).
3. **Client-side navigation script architecture** is brittle to growth (DOM query + imperative class toggling + unscoped side effects).

The highest-value modernization path is:

- Extract data and repeated UI into small composable components.
- Standardize content sources and site constants.
- Introduce light tooling guardrails (lint/type/format/perf checks).
- Optionally modernize Tailwind integration strategy (Astro 5 + Tailwind 3 legacy integration currently in use).

---

## Current-State Findings (by file)

## 1) `src/pages/resume.astro` (highest debt)

### Observations

- Very large file with deeply repeated section/card/list patterns.
- Repeated class strings (`leading-relaxed tracking-wide text-gray-700`, etc.) appear many times.
- Content and presentation are tightly interwoven.

### Risks

- High edit risk for copy/content updates.
- Inconsistent styling likely over time due to repeated utility strings.
- Difficult to test/refactor incrementally because structure is monolithic.

### Refactor Direction

- Move resume data to a structured data module (e.g., `src/data/resume.ts` or JSON).
- Create reusable components:
  - `ResumeSection.astro`
  - `ResumeItem.astro`
  - `ResumeTimelineItem.astro`
  - `ResumeBulletList.astro`
  - `OrganizationHeader.astro`
- Collapse repeated utility clusters into semantic utility groups via `@layer components` classes in global CSS **or** component partials with shared class constants.

### Expected Wins

- 40–60% markup reduction in page file.
- Faster content iteration.
- Lower risk of accidental visual regressions.

---

## 2) `src/layouts/Layout.astro`

### Observations

- Metadata and JSON-LD are inline and mostly hardcoded.
- Domain values are inconsistent across project setup:
  - `astro.config.mjs` uses `https://traviswindsor.com`
  - layout metadata uses `https://windsor-cummings.com` and `https://www.windsor-cummings.com`
- Layout currently owns global concerns + SEO + fonts + shell components.

### Risks

- SEO/social metadata drift.
- Incorrect canonical identity if domain changes.
- Hard to reuse if site grows (e.g., blog, project pages, campaign landing pages).

### Refactor Direction

- Create a centralized site config module (e.g., `src/config/site.ts`) for:
  - site URL
  - author identity
  - social links
  - default title/description
  - image defaults
- Move JSON-LD generation into a helper (`src/lib/seo.ts`) with typed outputs.
- Introduce a lightweight SEO component (`SeoHead.astro`) and keep `Layout.astro` focused on shell composition.

### Expected Wins

- Single source of truth for metadata.
- Eliminates domain inconsistencies.
- Simpler head composition and reduced duplication across future pages.

---

## 3) `src/components/Navigation.astro`

### Observations

- Uses imperative script with DOM ids/classes and direct listeners.
- Animated class names (`slide1`...`slide5`) rely on positional assumptions.
- `currentPath` is computed but currently unused.
- Script architecture can become fragile as menu items evolve.

### Risks

- Hidden behavior coupling between markup order and animation classes.
- Hard to scale nav items dynamically.
- Event lifecycle/cleanup concerns if future client-side routing or transitions are introduced.

### Refactor Direction

- Refactor to data-driven nav model:
  - `const navItems = [...]` with label, href, ariaLabel, color class.
- Replace hardcoded `slide1..5` with computed `data-index` + single class strategy.
- Keep script minimal and deterministic:
  - one source of state (`isOpen`)
  - helper functions for open/close
  - no duplicated queries
- If transitions are adopted later, wire listener setup through lifecycle-safe hooks.

### Expected Wins

- Easier to add/remove nav items safely.
- Better readability and lower animation coupling.

---

## 4) `src/components/Icon.astro`

### Observations

- Large conditional tree of inline SVG blocks in a single file.
- Good typing exists for icon names, but rendering logic is verbose.

### Risks

- Difficult to maintain or audit for accessibility consistency.
- File grows linearly with every new icon.

### Refactor Direction

- Convert to map-based icon registry:
  - icon path data in object map keyed by icon type.
  - shared `<svg>` wrapper and per-icon `viewBox`/path payload.
- Optionally split into `src/icons/*.ts` or `src/components/icons/*.astro` if icon set expands.

### Expected Wins

- Cleaner, smaller component logic.
- Better maintainability for future icon additions.

---

## 5) `src/components/ContactForm.astro`

### Observations

- Netlify form integration is mostly correct (`data-netlify`, `name`, honeypot).
- Form styling is repeated and not abstracted.
- No explicit validation attributes (`required`, `autocomplete`) in current markup.

### Risks

- Accessibility and UX quality could degrade as fields evolve.
- Style drift due to repeated utility blocks.

### Refactor Direction

- Extract shared input/textarea class tokens to reusable class constants or component wrappers.
- Add semantic form enhancements:
  - `required` where applicable
  - `autocomplete` attributes
  - `aria-describedby` for hint/error text (if adding validation UX)
- Keep Netlify hidden field strategy aligned with deployment mode if form rendering changes.

### Expected Wins

- Better form readability and user experience.
- Lower maintenance cost for future field changes.

---

## 6) `src/pages/index.astro` and `src/components/Skills.astro`

### Observations

- `Skills` already uses a data array and map rendering (good pattern).
- Hero content and typography classes are readable but could benefit from class reuse patterns.

### Refactor Direction

- Mirror `Skills` data-driven approach for other repeated page content where possible.
- Extract frequently repeated text style utility groups into semantic classes.

---

## 7) `src/styles/global.css`

### Observations

- Contains navigation-specific state classes (`hamActive`, `slide1..5`, etc.).
- Style set is focused, but naming is tied to implementation details.

### Refactor Direction

- Adopt a component-oriented naming strategy for nav state styles.
- Replace enumerated animation classes (`slide1..5`) with data-driven timing via CSS variables or a simpler shared animation strategy.
- Keep global stylesheet reserved for true globals; move component-local concerns closer to components when practical.

---

## 8) Tooling and Dependencies

### Observations

- Using Astro 5 with legacy Tailwind 3 integration (`@astrojs/tailwind` + `tailwindcss@3`).
- `sass` is present in dependencies but no Sass usage appears in project source.

### Refactor Direction

- Evaluate whether `sass` can be removed (if truly unused).
- Decide strategically:
  - **Stay on Tailwind 3 legacy integration** (minimum change), or
  - **Plan controlled migration to Tailwind 4 plugin model** supported by current Astro docs.
- Add/standardize quality gates:
  - formatting check
  - Astro type check
  - optional lint rules for a11y and unused variables/imports.

### Expected Wins

- Smaller dependency surface.
- Better long-term maintainability and update path.

---

## Cross-Cutting Refactor Themes

## A) Content/Data Separation

Move static content out of large templates into typed data modules where possible:

- improves readability
- supports future CMS or content collection migration
- reduces accidental structural edits.

## B) Component Contract Tightening

For reusable components:

- formalize props interfaces
- enforce defaults centrally
- avoid unused variables/props.

## C) Class Reuse Strategy

Use a pragmatic approach to avoid over-abstraction:

- keep one-off utility classes inline
- extract repeated style clusters used 3+ times
- prefer componentization over heavy custom CSS for multi-element UI patterns.

## D) Metadata/SEO Reliability

Centralize canonical URLs and social metadata fields in one module to prevent drift and broken previews.

---

## Prioritized Refactor Backlog

## Phase 1 — Low Risk / High Return

1. Normalize site metadata constants (domain, URLs, social links).
2. Remove unused code signals (e.g., unused `currentPath` in nav).
3. Extract repeated utility class clusters in resume/contact areas.
4. Add basic validation/accessibility improvements to form fields.

**Risk:** Low  
**Effort:** Small–Medium  
**Impact:** Immediate readability + consistency gains.

## Phase 2 — Structural Refactor

1. Break `resume.astro` into data + composable UI primitives.
2. Move SEO generation into helper/component.
3. Refactor nav to data-driven rendering and cleaner animation coupling.

**Risk:** Medium  
**Effort:** Medium  
**Impact:** Major maintainability and scalability improvement.

## Phase 3 — Modernization and Hardening

1. Evaluate dependency cleanup (`sass`, other unused packages).
2. Decide on Tailwind 3 legacy vs Tailwind 4 migration timeline.
3. Add CI checks (build/type/format and optional lint/a11y).

**Risk:** Medium  
**Effort:** Medium  
**Impact:** Better upgrade posture, fewer regressions.

---

## Validation Strategy for Safe Refactoring

For each phase:

1. **Visual parity checks** across home/resume/contact/nav states.
2. **Build + type checks** (`astro check`, `astro build`).
3. **Accessibility smoke checks**:
   - keyboard nav (menu + form)
   - focus visibility
   - semantic headings and labels.
4. **SEO regression checks**:
   - title/description
   - OG/Twitter tags
   - JSON-LD output consistency.
5. **Form submission checks** in Netlify preview/deploy contexts.

---

## Suggested Target Architecture (Incremental)

```
src/
  components/
    seo/
      SeoHead.astro
    resume/
      ResumeSection.astro
      ResumeItem.astro
      ResumeBulletList.astro
    nav/
      Navigation.astro
  config/
    site.ts
  data/
    resume.ts
    social.ts
  lib/
    seo.ts
```

This structure keeps concerns explicit without over-engineering for current project size.

---

## Refactor Anti-Patterns to Avoid

- Over-abstracting every utility class into custom CSS.
- Performing visual redesign while doing structural refactor (separate concerns).
- Mixing dependency upgrades with large component extraction in one PR.
- Introducing runtime complexity for static content that could stay compile-time.

---

## Final Recommendation

Treat this as a **three-pass modernization**:

1. **Consistency pass** (metadata/constants/duplication cleanup).
2. **Modularization pass** (`resume` + `navigation` + SEO extraction).
3. **Platform pass** (dependency and tooling modernization).

This sequence minimizes risk, preserves behavior, and yields a significantly cleaner architecture with better long-term maintainability.
