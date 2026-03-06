# Design System Polish Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Polish the portfolio's design system across typography (Space Grotesk + Inter + Space Mono), spacing (canonical tokens), and component internals (cards, form fields, buttons, timeline, resume).

**Architecture:** Pure token/class changes — no structural or content changes. Every file touched is an existing component or config. No new files needed. Run `npm run dev` after each task to verify visually, then `npm run ci` at the end as the final gate.

**Tech Stack:** Astro 5, Tailwind CSS v4 (via @tailwindcss/vite), Google Fonts, vanilla CSS in `src/styles/global.css`

**Design doc:** `docs/plans/2026-03-06-design-system-polish-design.md`

---

## Task 1: Font Stack Foundation

Swap Barlow Condensed → Syne, add Inter as body font. This is the foundation everything else builds on.

**Files:**
- Modify: `tailwind.config.mjs`
- Modify: `src/layouts/Layout.astro`

**Step 1: Update tailwind.config.mjs font families**

Current `fontFamily` block:
```js
fontFamily: {
  display: ['"Barlow Condensed"', 'sans-serif'],
  mono: ['"Space Mono"', 'monospace'],
},
```

Replace with:
```js
fontFamily: {
  display: ['"Space Grotesk"', 'sans-serif'],
  body: ['"Inter"', 'sans-serif'],
  mono: ['"Space Mono"', 'monospace'],
},
```

**Step 2: Update Google Fonts URL in Layout.astro**

Find the existing `<link href="https://fonts.googleapis.com/css2?...">` tag (around line 26) and replace the `href` value:

Replace:
```
href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700&family=Space+Mono&display=swap"
```

With:
```
href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500&family=Space+Grotesk:wght@700&family=Space+Mono&display=swap"
```

**Step 3: Verify dev server**

Run: `npm run dev`
Open `http://localhost:4321` — the hero wordmark should now render in Space Grotesk. It will look wider/bigger than Barlow Condensed — that's expected and will be fixed in Task 3.

**Step 4: Commit**

```bash
git add tailwind.config.mjs src/layouts/Layout.astro
git commit -m "feat: swap Barlow Condensed for Syne, add Inter as body font"
```

---

## Task 2: BracketHeader Label Size

The section labels (`[ BILL OF MATERIALS ]`, `[ INITIATE CONTACT ]`, etc.) are currently `text-xs`. Bumping to `text-sm` improves readability while keeping the mono/bracket blueprint identity.

**Files:**
- Modify: `src/components/blueprint/BracketHeader.astro`

**Step 1: Update title span**

In `BracketHeader.astro`, find the title span (line 19):
```html
<span class="text-bp-text uppercase shrink-0">{title}</span>
```

Change to:
```html
<span class="text-bp-text text-sm uppercase shrink-0">{title}</span>
```

The meta span (line 24) stays `text-xs` — no change needed there.

**Step 2: Verify**

Run: `npm run dev`
Check the `/#skills` section. The `[ BILL OF MATERIALS ]` label should be slightly larger. The meta `REV: CURRENT  QTY: 04` stays at its current small size.

**Step 3: Commit**

```bash
git add src/components/blueprint/BracketHeader.astro
git commit -m "refactor: bump BracketHeader title to text-sm for readability"
```

---

## Task 3: Hero Wordmark Sizes + Tagline

Syne is wider than Barlow Condensed. Reduce the vw values so the wordmark fills the viewport similarly to before. Also increase the tagline size slightly — Syne 800 can carry it.

**Files:**
- Modify: `src/pages/index.astro`

**Step 1: Update the h1 vw sizes**

Find the `<h1>` block in the hero section (around lines 21–28):

```html
<h1
  class="font-display text-bp-text select-none text-center md:text-left"
  style="line-height: 0.88;"
>
  <span class="block text-[28vw] md:text-[18vw]">TRAVIS</span>
  <span class="block text-[11vw] md:text-[7vw]">WINDSOR-CUMMINGS</span>
</h1>
```

Replace with:
```html
<h1
  class="font-display text-bp-text select-none text-center md:text-left"
  style="line-height: 0.88;"
>
  <span class="block text-[22vw] md:text-[14vw]">TRAVIS</span>
  <span class="block text-[8.5vw] md:text-[5.5vw]">WINDSOR-CUMMINGS</span>
</h1>
```

**Step 2: Update the tagline size**

Find the tagline paragraph (around lines 57–64):

```html
<p
  class="font-display text-2xl md:text-3xl text-bp-text tracking-wider uppercase text-center md:text-left"
  ...
>
```

Change `md:text-3xl` → `md:text-4xl`:
```html
<p
  class="font-display text-2xl md:text-4xl text-bp-text tracking-wider uppercase text-center md:text-left"
  ...
>
```

**Step 3: Verify**

Run: `npm run dev`
- "TRAVIS" should fill approximately the same visual width as before on mobile and desktop
- The tagline "Field tested. Built differently." should be noticeably larger on desktop
- Check at multiple breakpoints (mobile 375px, tablet 768px, desktop 1280px)

**Step 4: Commit**

```bash
git add src/pages/index.astro
git commit -m "refactor: adjust hero vw sizes for Syne width, bump tagline to text-4xl"
```

---

## Task 4: Hero CTA Button Consistency

The hero CTA uses `hover:bg-transparent hover:text-bp-amber` — on hover the button goes from filled to hollow, which is jarring. The contact form submit uses `btn-transmit` (steel sweep from right), which is polished. Standardize both to `btn-transmit`.

**Files:**
- Modify: `src/pages/index.astro`

**Step 1: Update primary CTA classes**

Find the primary CTA anchor (around lines 74–82):
```html
<a
  href="/resume"
  class="inline-block px-8 py-3 font-display text-xl tracking-widest text-bp-bg border-2 border-bp-amber bg-bp-amber hover:bg-transparent hover:text-bp-amber transition-colors duration-300"
  data-animate="fade"
  data-animate-delay="1000"
>
  VIEW RECORD →
</a>
```

Replace with:
```html
<a
  href="/resume"
  class="btn-transmit inline-block px-8 py-3 font-display text-xl tracking-widest text-bp-bg border-2 border-bp-amber bg-bp-amber hover:text-bp-bg transition-colors duration-300"
  data-animate="fade"
  data-animate-delay="1000"
>
  VIEW RECORD →
</a>
```

Key changes: added `btn-transmit`, removed `hover:bg-transparent hover:text-bp-amber`, added `hover:text-bp-bg` (keeps dark text readable on the steel sweep fill).

**Step 2: Verify**

Run: `npm run dev`
Hover the "VIEW RECORD →" button. The steel blue should sweep in from the right (same as the "TRANSMIT →" button on the contact form). Text should stay dark throughout.

**Step 3: Commit**

```bash
git add src/pages/index.astro
git commit -m "fix: standardize hero CTA to btn-transmit sweep hover"
```

---

## Task 5: Home Section Spacing

Sections currently use `py-32 md:py-40` (8rem/10rem). This is over-spaced — sections feel like they're trying to fill empty space. Tighten to `py-20 md:py-28` across all three home sections.

**Files:**
- Modify: `src/pages/index.astro` (Story section)
- Modify: `src/components/Skills.astro`
- Modify: `src/components/ContactForm.astro`

**Step 1: Update Story section in index.astro**

Find the `#story` section opening tag (around line 143):
```html
<section
  id="story"
  class="px-6 py-32 md:px-12 md:py-40 border-t border-bp-border"
>
```

Replace:
```html
<section
  id="story"
  class="px-6 py-20 md:px-12 md:py-28 border-t border-bp-border"
>
```

**Step 2: Update Skills.astro section**

Find the `<section>` opening tag in `src/components/Skills.astro` (line 40):
```html
<section
  id="skills"
  class="px-6 py-32 md:px-12 md:py-40 border-t border-bp-border"
>
```

Replace:
```html
<section
  id="skills"
  class="px-6 py-20 md:px-12 md:py-28 border-t border-bp-border"
>
```

**Step 3: Update ContactForm.astro section**

Find the `<section>` opening tag in `src/components/ContactForm.astro` (line 7):
```html
<section
  id="contact"
  class="px-6 py-32 md:px-12 md:py-40 border-t border-bp-border"
>
```

Replace:
```html
<section
  id="contact"
  class="px-6 py-20 md:px-12 md:py-28 border-t border-bp-border"
>
```

**Step 4: Also tighten form field stack spacing in ContactForm.astro**

Find `class="space-y-6"` on the `<form>` element (line 27):
```html
class="space-y-6"
```
Replace:
```html
class="space-y-5"
```

**Step 5: Verify**

Run: `npm run dev`
Scroll the home page. Sections should feel tighter and more confident — less empty space between content areas. The overall page height should be noticeably shorter.

**Step 6: Commit**

```bash
git add src/pages/index.astro src/components/Skills.astro src/components/ContactForm.astro
git commit -m "refactor: tighten home section padding from py-32/40 to py-20/28"
```

---

## Task 6: FormField Component Polish

Three polish improvements: (1) add a dark card background so inputs visually read as inputs, (2) fix asymmetric padding, (3) add focus ring, (4) apply Inter to input text.

**Files:**
- Modify: `src/components/blueprint/FormField.astro`

**Step 1: Update the border container div**

Find the inner container div (line 34):
```html
<div
  class="relative border border-bp-border focus-within:border-bp-amber transition-colors duration-200"
>
```

Replace:
```html
<div
  class="relative border border-bp-border bg-bp-card focus-within:border-bp-amber focus-within:ring-1 focus-within:ring-bp-amber/30 transition-colors duration-200"
>
```

**Step 2: Fix padding symmetry on inner div**

Find the padding div (line 38):
```html
<div class="px-4 pt-3 pb-1">
```

Replace:
```html
<div class="px-4 py-3">
```

**Step 3: Add font-body to textarea**

Find the textarea element (around line 46):
```html
<textarea
  ...
  class="w-full bg-transparent text-bp-text text-sm outline-none pb-2 resize-none"
/>
```

Replace:
```html
<textarea
  ...
  class="w-full bg-transparent font-body text-base text-bp-text outline-none resize-none"
/>
```

**Step 4: Add font-body to input**

Find the input element (around line 53):
```html
<input
  ...
  class="w-full bg-transparent text-bp-text text-sm outline-none pb-2 placeholder:text-bp-border"
/>
```

Replace:
```html
<input
  ...
  class="w-full bg-transparent font-body text-base text-bp-text outline-none placeholder:text-bp-border"
/>
```

**Step 5: Verify**

Run: `npm run dev`
Navigate to the `/#contact` section:
- Each form field should have a visible dark card background (`#111518`) distinguishing it from the page background
- Click into a field — the border should turn amber AND a soft amber ring glow should appear around the entire field
- Input text should be in Inter (smoother than the previous system default)

**Step 6: Commit**

```bash
git add src/components/blueprint/FormField.astro
git commit -m "refactor: polish FormField with card bg, symmetric padding, focus ring, Inter font"
```

---

## Task 7: Skills Card Polish

Three improvements: fix the backwards ghost number opacity on hover, add a subtle amber border glow on hover, apply Inter to the description prose.

**Files:**
- Modify: `src/components/Skills.astro`

**Step 1: Fix card container — hover border + padding**

Find each skill card `<div>` (the one with `bp-grid-card group relative border...`). It currently has `p-8`. There is one per skill (4 total), all generated from a `.map()`. Find the `class:list` on the card div (around line 57):

```js
class:list={[
  'bp-grid-card group relative border border-bp-border p-8',
  offsets[index],
]}
```

Replace:
```js
class:list={[
  'bp-grid-card group relative border border-bp-border p-6 md:p-8 hover:border-bp-amber/20 transition-colors duration-300',
  offsets[index],
]}
```

**Step 2: Fix ghost number opacity (backwards hover)**

Find the ghost number div (around line 67):
```html
<div
  class="absolute top-4 right-6 font-mono text-7xl font-bold text-bp-amber select-none pointer-events-none transition-opacity duration-150 group-hover:opacity-50"
  style="opacity: 0.15;"
  aria-hidden="true"
>
```

Replace:
```html
<div
  class="absolute top-4 right-6 font-mono text-7xl font-bold text-bp-amber select-none pointer-events-none transition-opacity duration-150 group-hover:opacity-[0.18]"
  style="opacity: 0.08;"
  aria-hidden="true"
>
```

Key changes: base `opacity: 0.15` → `0.08` (more subtle at rest), `group-hover:opacity-50` → `group-hover:opacity-[0.18]` (subtly reveals on hover instead of disappearing further).

**Step 3: Apply Inter to description paragraph**

Find the description `<p>` (around line 77):
```html
<p class="text-bp-text opacity-75 leading-relaxed text-sm relative z-10 mb-6">
```

Replace:
```html
<p class="font-body text-base text-bp-text opacity-75 leading-7 relative z-10 mb-6">
```

**Step 4: Verify**

Run: `npm run dev`
Navigate to `/#skills`:
- Hover a skill card — the border should get a very faint amber tint, corner ticks should expand (existing behavior preserved)
- The ghost number should be barely visible at rest and slightly more visible on hover (not less visible)
- Description text should be in Inter at 16px

**Step 5: Commit**

```bash
git add src/components/Skills.astro
git commit -m "refactor: polish skill cards — fix ghost opacity, amber hover border, Inter prose"
```

---

## Task 8: CareerTimeline Prose + Font-Bold Fix

Two fixes: remove `font-bold` from date spans (Space Mono has no bold variant — the class is a no-op that may trigger weight synthesis), and apply Inter to description paragraphs.

**Files:**
- Modify: `src/components/CareerTimeline.astro`

**Step 1: Remove font-bold from date spans**

Find the date span inside the `.map()` (around line 96):
```html
<span
  class:list={[
    'font-mono text-3xl md:text-4xl leading-none font-bold',
    m.typeColor === 'steel' ? 'text-bp-steel' : 'text-bp-amber',
  ]}
>
```

Replace:
```html
<span
  class:list={[
    'font-mono text-3xl md:text-4xl leading-none',
    m.typeColor === 'steel' ? 'text-bp-steel' : 'text-bp-amber',
  ]}
>
```

**Step 2: Apply Inter to description paragraphs**

Find the description paragraph (around line 112):
```html
<p class="text-bp-text opacity-75 leading-relaxed text-sm md:text-base mb-3 max-w-2xl">
```

Replace:
```html
<p class="font-body text-base text-bp-text opacity-75 leading-7 mb-3 max-w-2xl">
```

**Step 3: Verify**

Run: `npm run dev`
Navigate to the `#story` section:
- Timeline dates (e.g., "APR 2022", "2014–2019") should look unchanged — they were never actually bold since Space Mono doesn't support it
- Description paragraphs should be in Inter with slightly more breathing room

**Step 4: Commit**

```bash
git add src/components/CareerTimeline.astro
git commit -m "fix: remove no-op font-bold from Space Mono dates; apply Inter to timeline prose"
```

---

## Task 9: Resume Page Spacing

The resume page uses `py-10` with no responsive step — much tighter than the rest of the site. Add a responsive breakpoint so it gets more breathing room on larger screens. Fix sidebar nav spacing.

**Files:**
- Modify: `src/pages/resume.astro`

**Step 1: Update sidebar padding + nav spacing**

Find the `<aside>` element (around line 16):
```html
<aside
  class="hidden lg:block w-56 shrink-0 sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto border-r border-bp-border px-6 py-10"
  ...
>
```

Replace:
```html
<aside
  class="hidden lg:block w-56 shrink-0 sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto border-r border-bp-border px-6 py-10 lg:py-16"
  ...
>
```

Find the sidebar nav `<ul>` (around line 23):
```html
<ul class="space-y-3 list-none p-0">
```

Replace:
```html
<ul class="space-y-4 list-none p-0">
```

**Step 2: Update main content padding**

Find the `<main>` element (around line 44):
```html
<main class="flex-1 px-6 py-10 md:px-12 max-w-4xl">
```

Replace:
```html
<main class="flex-1 px-6 py-10 md:py-16 md:px-12 max-w-4xl">
```

**Step 3: Verify**

Run: `npm run dev`
Navigate to `/resume`:
- On desktop (1280px+), the page should have more breathing room above the "Personnel File" bracket header
- Sidebar nav items should be slightly more spread out

**Step 4: Commit**

```bash
git add src/pages/resume.astro
git commit -m "refactor: add responsive padding to resume page and sidebar spacing"
```

---

## Task 10: Resume Component Prose

Apply Inter to all prose text in the resume components.

**Files:**
- Modify: `src/components/resume/ResumeItem.astro`
- Modify: `src/components/resume/ResumeBulletList.astro`

**Step 1: Update ResumeItem description paragraph**

In `src/components/resume/ResumeItem.astro`, find the description `<p>` (around line 71):
```html
<p
  class:list={[
    'text-sm text-bp-text opacity-75 leading-relaxed mb-2',
    entry.descriptionClass,
  ]}
>
```

Replace:
```html
<p
  class:list={[
    'font-body text-base text-bp-text opacity-75 leading-7 mb-2',
    entry.descriptionClass,
  ]}
>
```

**Step 2: Update ResumeBulletList items**

In `src/components/resume/ResumeBulletList.astro`, find the `<li>` class (line 11):
```html
<li class="flex gap-3 text-sm text-bp-text opacity-75 leading-relaxed">
```

Replace:
```html
<li class="flex gap-3 font-body text-base text-bp-text opacity-75 leading-7">
```

**Step 3: Verify**

Run: `npm run dev`
Navigate to `/resume`:
- Job descriptions and bullet points should now render in Inter at 16px with `leading-7`
- Monospace role/date labels (Space Mono) should be unchanged

**Step 4: Commit**

```bash
git add src/components/resume/ResumeItem.astro src/components/resume/ResumeBulletList.astro
git commit -m "refactor: apply Inter body font to resume prose and bullet items"
```

---

## Task 11: Final CI Gate

Run the full CI pipeline to verify nothing is broken.

**Step 1: Run CI**

```bash
npm run ci
```

This runs in order: `format:check` → `lint` → `lint:a11y:strict` → `build`

**Expected output:** All steps pass. Build completes without errors.

**Step 2: If format:check fails**

Run `npm run format` to auto-fix, then re-run `npm run ci`.

**Step 3: If lint fails**

Read the specific rule violation. Common issues:
- Missing `alt` on an image you may have accidentally touched
- Unused import

Fix the specific issue, don't suppress the rule.

**Step 4: If build fails**

Read the TypeScript/Astro error. Most likely a class name typo (e.g. `font-body` not resolving — verify it's in `tailwind.config.mjs` under `fontFamily`).

**Step 5: Confirm success**

All steps green. Design system polish is complete.

---

## Success Checklist

- [ ] Space Grotesk 700 renders on the hero wordmark and all `font-display` headings
- [ ] Inter renders on all prose paragraphs and form inputs (no system font fallback)
- [ ] Space Mono unchanged on all labels, metadata, brackets
- [ ] Hero wordmark fills the viewport similarly to before (vw values adjusted)
- [ ] All three home sections use `py-20 md:py-28`
- [ ] Form fields have visible `bg-bp-card` background
- [ ] Form field focus shows amber ring glow
- [ ] Hero CTA and contact submit both use btn-transmit sweep hover
- [ ] Skill card ghost number subtly appears on hover (not disappears)
- [ ] Skill cards have faint amber border glow on hover
- [ ] `font-bold` removed from Space Mono date spans in timeline
- [ ] Resume page has responsive padding (`py-10 md:py-16`)
- [ ] `npm run ci` passes clean
