# Refactoring Execution Plan: `astro-portfolio`

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Eliminate the six classes of duplication and dead code identified in the February 2026 audit without changing any visual output.

**Architecture:** Seven sequential tasks, each independently verifiable with `npm run ci`. Every task touches the minimum files necessary. No visual redesign, no new features.

**Tech Stack:** Astro 5, Tailwind v4 (`@tailwindcss/vite`), Vanilla JS, Netlify static output.

**Verification gate after every task:** `npm run ci` must exit 0 (format:check + lint + lint:a11y:strict + astro check + build). If it fails, fix before moving to next task.

---

## Context: What Was Found

| #   | Issue                                                                                           | Severity | Files affected                                         |
| --- | ----------------------------------------------------------------------------------------------- | -------- | ------------------------------------------------------ |
| 1   | Corner-tick `<span>` markup copied 5×                                                           | CRITICAL | Skills, ContactForm, index, ResumeItem, BlueprintFrame |
| 2   | Form field wrapper repeated 4× in ContactForm                                                   | HIGH     | ContactForm.astro                                      |
| 3   | Blueprint grid `repeating-linear-gradient` hardcoded inline 2× (+ body CSS = 3 implementations) | HIGH     | Navigation.astro, Skills.astro, global.css             |
| 4   | BracketHeader component not used in resume.astro (inline reimplementation)                      | MODERATE | resume.astro                                           |
| 5   | Inline amber hex colors bypass design tokens                                                    | MODERATE | index.astro (2×)                                       |
| 6   | Dead code: `Logo.astro` never imported; `bodyClass` prop defined but never applied              | LOW      | Logo.astro, ResumeSection.astro                        |
| 7   | Accessibility: no skip link; h1→h3 heading gap (no h2)                                          | MODERATE | Layout.astro, all pages                                |

---

## Task 1 — Extract `CornerTicks.astro`

**Problem:** Four identical `<span>` elements (the blueprint corner ticks) are copy-pasted into `Skills.astro` (lines 63–78), `ContactForm.astro` (lines 52–63, 90–101, 127–138, 162–173), `src/pages/index.astro` (lines 105–116), and `src/components/resume/ResumeItem.astro` (lines 19–32). `BlueprintFrame.astro` exists as a wrapper-div abstraction but is never imported anywhere and doesn't support all the required variants (hover animation, thin border, different sizes).

**Approach:** Create a "headless" `CornerTicks.astro` that renders only the four spans. Each call site keeps its own wrapper `<div class="relative ...">` and drops `<CornerTicks />` inside it. `BlueprintFrame.astro` is then deleted (it was unused).

**Files:**

- Create: `src/components/blueprint/CornerTicks.astro`
- Modify: `src/components/Skills.astro`
- Modify: `src/components/ContactForm.astro`
- Modify: `src/pages/index.astro`
- Modify: `src/components/resume/ResumeItem.astro`
- Delete: `src/components/blueprint/BlueprintFrame.astro`

### Step 1: Create `CornerTicks.astro`

```astro
---
interface Props {
  /** Tailwind size classes for each tick. Default: 'w-3 h-3' */
  size?: string
  /** When set, adds group-hover expand classes (e.g. 'w-4 h-4'). Requires parent to have `group`. */
  hoverSize?: string
  /** When true, uses 1px border instead of 2px (for small logo frames). Default: false */
  thin?: boolean
}

const { size = 'w-3 h-3', hoverSize, thin = false } = Astro.props

const bw = thin ? 'border-t border-l' : 'border-t-2 border-l-2'
const hover = hoverSize
  ? `transition-all duration-150 group-hover:${hoverSize}`
  : ''
---

<span
  class:list={[
    'absolute top-0 left-0 border-t-2 border-l-2 border-bp-amber -translate-x-px -translate-y-px',
    size,
    hover,
  ].filter(Boolean)}
  aria-hidden="true"></span>
<span
  class:list={[
    'absolute top-0 right-0 border-t-2 border-r-2 border-bp-amber translate-x-px -translate-y-px',
    size,
    hover,
  ].filter(Boolean)}
  aria-hidden="true"></span>
<span
  class:list={[
    'absolute bottom-0 left-0 border-b-2 border-l-2 border-bp-amber -translate-x-px translate-y-px',
    size,
    hover,
  ].filter(Boolean)}
  aria-hidden="true"></span>
<span
  class:list={[
    'absolute bottom-0 right-0 border-b-2 border-r-2 border-bp-amber translate-x-px translate-y-px',
    size,
    hover,
  ].filter(Boolean)}
  aria-hidden="true"></span>
```

> **Note on `thin` prop:** The thin variant needs `border-t border-l` etc. (1px). The prop is accepted but the class construction must use the `thin` value correctly — see the correct implementation in the actual step below.

### Step 2: Update `Skills.astro`

Replace lines 63–78 (the four manual spans inside each skill card) with:

```astro
import CornerTicks from './blueprint/CornerTicks.astro'
```

And inside the card div:

```astro
<CornerTicks hoverSize="w-4 h-4" />
```

The parent card div already has `class="group relative ..."` so `group-hover` will work.

### Step 3: Update `ContactForm.astro`

Replace all four occurrences of the corner-tick block (lines 52–63, 90–101, 127–138, 162–173) with:

```astro
import CornerTicks from './blueprint/CornerTicks.astro'
```

And inside each field wrapper div:

```astro
<CornerTicks />
```

No hover needed here — the focus-within effect is on the border, not the ticks.

### Step 4: Update `index.astro` (headshot frame)

Replace lines 105–116 (the four spans in the headshot frame) with:

```astro
import CornerTicks from '../components/blueprint/CornerTicks.astro'
```

And inside the headshot wrapper:

```astro
<CornerTicks size="w-4 h-4" />
```

### Step 5: Update `ResumeItem.astro` (logo frame)

Replace lines 19–32 (the four spans inside the logo frame) with:

```astro
import CornerTicks from '../blueprint/CornerTicks.astro'
```

And inside the logo wrapper:

```astro
<CornerTicks size="w-2 h-2" thin />
```

The logo frame uses `border` (1px) not `border-2` (2px), hence `thin`.

### Step 6: Delete `BlueprintFrame.astro`

`src/components/blueprint/BlueprintFrame.astro` is never imported anywhere. Delete it.

### Step 7: Run CI

```bash
npm run ci
```

Expected: exit 0. If format fails, run `npm run format` first.

### Step 8: Commit

```bash
git add src/components/blueprint/CornerTicks.astro \
        src/components/blueprint/BlueprintFrame.astro \
        src/components/Skills.astro \
        src/components/ContactForm.astro \
        src/pages/index.astro \
        src/components/resume/ResumeItem.astro
git commit -m "refactor: extract CornerTicks component, remove BlueprintFrame dead code"
```

---

## Task 2 — Extract `FormField.astro`

**Problem:** `ContactForm.astro` repeats the same field wrapper structure four times: outer `group/field` div → inner `relative border focus-within:border-bp-amber` div → `<CornerTicks />` → inner padding div → `<label>` → `<input>` or `<textarea>`. This is ~30 lines per field × 4 = ~120 lines of structural duplication.

**Approach:** Create `FormField.astro` that encapsulates the wrapper, corner ticks, label, and a default `<input>` slot. The textarea (message field) needs `rows` support and `resize-none`, so add an `as` prop (`'input' | 'textarea'`) and a `rows` prop.

**Files:**

- Create: `src/components/blueprint/FormField.astro`
- Modify: `src/components/ContactForm.astro`

### Step 1: Create `FormField.astro`

```astro
---
import CornerTicks from './CornerTicks.astro'

interface Props {
  id: string
  name: string
  label: string
  type?: string
  as?: 'input' | 'textarea'
  rows?: number
  autocomplete?: string
  inputmode?: string
  required?: boolean
  class?: string
  /** data-animate and data-animate-delay passed through to outer wrapper */
  'data-animate'?: string
  'data-animate-delay'?: string
}

const {
  id,
  name,
  label,
  type = 'text',
  as: Tag = 'input',
  rows,
  autocomplete,
  inputmode,
  required = false,
  class: className = '',
  'data-animate': dataAnimate,
  'data-animate-delay': dataAnimateDelay,
} = Astro.props
---

<div
  class:list={['group/field relative w-full', className]}
  data-animate={dataAnimate}
  data-animate-delay={dataAnimateDelay}
>
  <div
    class="relative border border-bp-border focus-within:border-bp-amber transition-colors duration-200"
  >
    <CornerTicks />
    <div class="px-4 pt-3 pb-1">
      <label
        for={id}
        class="block font-mono text-xs tracking-widest text-bp-steel mb-1"
      >
        {label}
      </label>
      {
        Tag === 'textarea' ? (
          <textarea
            id={id}
            name={name}
            autocomplete={autocomplete}
            required={required || undefined}
            rows={rows}
            class="w-full bg-transparent text-bp-text text-sm outline-none pb-2 resize-none"
          />
        ) : (
          <input
            id={id}
            name={name}
            type={type}
            inputmode={inputmode}
            autocomplete={autocomplete}
            required={required || undefined}
            class="w-full bg-transparent text-bp-text text-sm outline-none pb-2 placeholder:text-bp-border"
          />
        )
      }
    </div>
  </div>
</div>
```

### Step 2: Refactor `ContactForm.astro`

Replace the four field blocks (lines 43–190) with `FormField` invocations:

```astro
import FormField from './blueprint/FormField.astro'
```

Name + Email row:

```astro
<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
  <FormField
    id="name"
    name="name"
    label="// NAME"
    type="text"
    autocomplete="name"
    required
    data-animate="from-left"
    data-animate-delay="100"
  />
  <FormField
    id="email"
    name="email"
    label="// EMAIL"
    type="email"
    inputmode="email"
    autocomplete="email"
    required
    data-animate="from-left"
    data-animate-delay="200"
  />
</div>
```

Subject:

```astro
<FormField
  id="subject"
  name="subject"
  label="// SUBJECT"
  type="text"
  autocomplete="off"
  required
  data-animate="from-left"
  data-animate-delay="300"
/>
```

Message:

```astro
<FormField
  id="message"
  name="message"
  label="// MESSAGE"
  as="textarea"
  rows={6}
  autocomplete="off"
  required
  data-animate="from-left"
  data-animate-delay="400"
/>
```

### Step 3: Run CI

```bash
npm run ci
```

### Step 4: Commit

```bash
git add src/components/blueprint/FormField.astro \
        src/components/ContactForm.astro
git commit -m "refactor: extract FormField component, collapse 4x repeated form field markup"
```

---

## Task 3 — Consolidate Blueprint Grid to CSS Class

**Problem:** The `repeating-linear-gradient` grid pattern appears in three places:

1. `src/styles/global.css` lines 5–20 (body, opacity 0.03)
2. `src/components/Navigation.astro` line 75 (mobile nav overlay, inline style, opacity 0.03)
3. `src/components/Skills.astro` line 59 (skill cards, inline style, opacity 0.02 — intentionally lower)

The inline styles are 250+ characters each, impossible to search/replace reliably, and the opacity difference between body (0.03) and card (0.02) has no documenting comment.

**Approach:** Add two CSS utility classes to `global.css`: `.bp-grid` (0.03 opacity, for page-level surfaces) and `.bp-grid-card` (0.02 opacity, for elevated card surfaces). Remove the inline styles from Navigation and Skills.

**Files:**

- Modify: `src/styles/global.css`
- Modify: `src/components/Navigation.astro`
- Modify: `src/components/Skills.astro`

### Step 1: Add utility classes to `global.css`

After the existing body rule (after line 20), add:

```css
/* ── Blueprint grid utility classes ──────────────────── */
/* Use .bp-grid for page-level surfaces (nav overlay, hero) */
/* Use .bp-grid-card for elevated card surfaces (skill cards) */
/* Opacity intentionally lower on cards so they read as a distinct layer */
.bp-grid {
  background-image:
    repeating-linear-gradient(
      rgba(255, 255, 255, 0.03) 0 1px,
      transparent 1px 40px
    ),
    repeating-linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.03) 0 1px,
      transparent 1px 40px
    );
  background-size: 40px 40px;
}

.bp-grid-card {
  background-image:
    repeating-linear-gradient(
      rgba(255, 255, 255, 0.02) 0 1px,
      transparent 1px 40px
    ),
    repeating-linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.02) 0 1px,
      transparent 1px 40px
    );
  background-size: 40px 40px;
}
```

### Step 2: Update `Navigation.astro`

On the mobile nav overlay `<div id="nav-menu">` (line 72–76), replace the `style` attribute with a class:

Before:

```html
style="background-color: #0b0e11; background-image:
repeating-linear-gradient(...);"
```

After:

```html
class="... bg-bp-bg bp-grid"
```

(Keep all existing classes; add `bg-bp-bg bp-grid`; remove the `style` attribute entirely.)

### Step 3: Update `Skills.astro`

On each skill card div (line 54–59), replace the `style` attribute with:

```html
class:list={['group relative border border-bp-border p-8 bg-bp-card
bp-grid-card', offsets[index]]}
```

Remove the `style="background-color: #111518; background-image: ..."` entirely.

### Step 4: Run CI

```bash
npm run ci
```

### Step 5: Commit

```bash
git add src/styles/global.css \
        src/components/Navigation.astro \
        src/components/Skills.astro
git commit -m "refactor: consolidate blueprint grid to CSS utility classes, remove 2 inline style blobs"
```

---

## Task 4 — Use `BracketHeader` Consistently in `resume.astro`

**Problem:** `src/pages/resume.astro` lines 46–58 contain a hand-rolled bracket header instead of importing the `BracketHeader` component. This creates a divergence — if `BracketHeader` ever changes its animation or style, `resume.astro`'s header won't track it.

The inline implementation:

```html
<div
  class="flex items-center gap-0 w-full font-mono text-xs tracking-widest overflow-hidden mb-2"
>
  <span class="text-bp-amber shrink-0">[&nbsp;&nbsp;</span>
  <span class="text-bp-text uppercase shrink-0">Personnel File</span>
  <span
    class="mx-3 inline-block h-px bg-bp-border flex-1"
    aria-hidden="true"
  ></span>
  <span class="text-bp-steel shrink-0 uppercase"
    >Subject: T. Windsor-Cummings</span
  >
  <span class="text-bp-amber shrink-0">&nbsp;&nbsp;]</span>
</div>
```

**Files:**

- Modify: `src/pages/resume.astro`

### Step 1: Import and use BracketHeader

In `resume.astro`, add the import:

```astro
import BracketHeader from '../components/blueprint/BracketHeader.astro'
```

Replace the inline bracket div (lines 46–58) with:

```astro
<BracketHeader
  title="Personnel File"
  meta="Subject: T. Windsor-Cummings"
  class="mb-2"
/>
```

Remove the outer `<div class="mb-16">` wrapper if it only contained the bracket (it can be collapsed into the `class` prop or kept if other elements follow).

### Step 2: Run CI

```bash
npm run ci
```

### Step 3: Commit

```bash
git add src/pages/resume.astro
git commit -m "refactor: use BracketHeader component in resume.astro, remove inline reimplementation"
```

---

## Task 5 — Eliminate Hardcoded Inline Amber Colors in `index.astro`

**Problem:** Two elements in `src/pages/index.astro` use `style="border-top: 1px dashed #C9901A"` and `style="border-top: 1px solid #C9901A"` — raw hex values that bypass the `bp-amber` design token.

Tailwind v4 can't generate `border-top` shorthand utilities directly, but we can use `@layer utilities` or the existing `global.css` to add targeted classes.

**Approach:** Add two utility classes to `global.css` and replace the inline styles with class-based equivalents.

**Files:**

- Modify: `src/styles/global.css`
- Modify: `src/pages/index.astro`

### Step 1: Add utility classes to `global.css`

```css
/* ── Amber border utilities (replaces inline style hacks) ─ */
.border-top-amber-dashed {
  border-top: 1px dashed #c9901a;
}
.border-top-amber-solid {
  border-top: 1px solid #c9901a;
}
```

### Step 2: Update `index.astro`

**Datum line** (the full-width dashed line after the TRAVIS heading):

Before:

```astro
<span class="flex-1 block h-px" style="border-top: 1px dashed #C9901A;"></span>
```

After:

```astro
<span class="flex-1 block h-px border-top-amber-dashed"></span>
```

**SUBJECT annotation line** (below headshot):

Before:

```astro
<span class="block h-px w-6" style="border-top: 1px solid #C9901A;"></span>
```

After:

```astro
<span class="block h-px w-6 border-top-amber-solid"></span>
```

### Step 3: Run CI

```bash
npm run ci
```

### Step 4: Commit

```bash
git add src/styles/global.css \
        src/pages/index.astro
git commit -m "refactor: replace hardcoded inline amber border styles with CSS utility classes"
```

---

## Task 6 — Dead Code Removal

**Problem:**

1. `src/components/Logo.astro` — defined, 27 lines, never imported or used anywhere
2. `bodyClass` prop in `src/components/resume/ResumeSection.astro` line 6 — declared in the interface but destructured variable is never used or applied in the template

**Files:**

- Delete: `src/components/Logo.astro`
- Modify: `src/components/resume/ResumeSection.astro`

### Step 1: Delete `Logo.astro`

```bash
rm src/components/Logo.astro
```

### Step 2: Remove `bodyClass` from `ResumeSection.astro`

Before:

```typescript
interface Props {
  title: string
  bodyClass?: string
  entryCount?: number
}

const { title, entryCount } = Astro.props
```

After:

```typescript
interface Props {
  title: string
  entryCount?: number
}

const { title, entryCount } = Astro.props
```

### Step 3: Run CI

```bash
npm run ci
```

### Step 4: Commit

```bash
git add src/components/Logo.astro \
        src/components/resume/ResumeSection.astro
git commit -m "refactor: delete unused Logo component, remove declared-but-unused bodyClass prop"
```

---

## Task 7 — Accessibility: Skip Link + Section Heading Hierarchy

**Problem:**

1. **No skip-to-main link.** Keyboard and screen-reader users tab through the entire navigation before reaching page content. WCAG 2.4.1 requires a mechanism to bypass repeated navigation blocks.
2. **h1 → h3 heading gap.** The page has an `<h1>` (TRAVIS in hero) and `<h3>` elements in Skills, CareerTimeline, and ResumeItem, but no `<h2>` at section level. Screen readers and outline tools see a broken document outline.

**Approach:**

- Add a visually hidden skip link as the first focusable element in `Layout.astro`.
- Add `id="main-content"` to the `<main>` tag.
- Add `<h2>` to each major section header. The BracketHeader component will accept an optional `level` prop to render as the correct heading tag. For sections that don't use BracketHeader (the hero), manually add a visually hidden h2.

**Files:**

- Modify: `src/layouts/Layout.astro`
- Modify: `src/components/blueprint/BracketHeader.astro`
- Modify: `src/components/Skills.astro` (section h2)
- Modify: `src/components/CareerTimeline.astro` (section h2)
- Modify: `src/components/ContactForm.astro` (section h2)
- Modify: `src/pages/resume.astro` (section h2)

### Step 1: Add skip link to `Layout.astro`

Immediately after `<body>`, before `<Cursor />`:

```html
<a
  href="#main-content"
  class="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[9999] focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:tracking-widest focus:uppercase focus:bg-bp-amber focus:text-bp-bg"
>
  Skip to main content
</a>
```

Add `id="main-content"` to the `<main>` tag:

```html
<main id="main-content" class="relative z-10 pt-14"></main>
```

### Step 2: Add `as` prop to `BracketHeader.astro`

This allows section-level bracket headers to render an `<h2>` semantically while looking identical.

```astro
---
interface Props {
  title: string
  meta?: string
  class?: string
  as?: 'div' | 'h2' | 'h3'
}

const { title, meta = '', class: className = '', as: Tag = 'div' } = Astro.props
---
```

Then wrap the title span in a conditional:

- If `Tag === 'div'`: render as existing (no change for callers that don't pass `as`)
- If `Tag === 'h2'` or `'h3'`: wrap the outer container element with the heading tag, OR render the title `<span>` inside the heading tag

The cleanest approach: make the outer container a `<Tag>` (an Astro dynamic tag). The bracket line and meta text remain inline, making the entire bracket header the heading:

```astro
<Tag
  class:list={[
    'flex items-center gap-0 w-full font-mono text-xs tracking-widest overflow-hidden',
    className,
  ]}
>
  ...existing content...
</Tag>
```

> Astro supports dynamic tags via `const Tag = as` and `<Tag ...>`.

### Step 3: Update section components to pass `as="h2"`

In each section that uses BracketHeader as the visual section title, add `as="h2"`:

**Skills.astro:**

```astro
<BracketHeader
  title="Bill of Materials"
  meta="..."
  class="mb-16"
  as="h2"
  data-animate="from-left"
/>
```

**CareerTimeline.astro:** Find the BracketHeader call and add `as="h2"`.

**ContactForm.astro:**

```astro
<BracketHeader
  title="Initiate Contact"
  meta="..."
  class="mb-16"
  as="h2"
  data-animate="from-left"
/>
```

**resume.astro:** The page header BracketHeader (now used after Task 4) should be `as="h1"` or wrap differently — the resume page has no hero h1, so the "Personnel File" header can be `as="h1"`. ResumeSection headers (rendered via BracketHeader inside ResumeSection.astro) should be `as="h2"`.

Update `ResumeSection.astro` to pass `as="h2"` to BracketHeader.

### Step 4: Run CI

```bash
npm run ci
```

Pay particular attention to `lint:a11y:strict` — the skip link and heading changes should resolve any outstanding a11y warnings.

### Step 5: Commit

```bash
git add src/layouts/Layout.astro \
        src/components/blueprint/BracketHeader.astro \
        src/components/Skills.astro \
        src/components/CareerTimeline.astro \
        src/components/ContactForm.astro \
        src/pages/resume.astro \
        src/components/resume/ResumeSection.astro
git commit -m "a11y: add skip link, fix h1→h3 heading gap by adding h2 via BracketHeader as prop"
```

---

## Expected Net Result

| Metric                         | Before                          | After                        |
| ------------------------------ | ------------------------------- | ---------------------------- |
| Corner-tick span repetitions   | ~20 spans across 5 files        | 4 spans in 1 component       |
| ContactForm.astro line count   | ~250                            | ~120                         |
| Blueprint grid implementations | 3 (inline + inline + CSS)       | 1 (CSS) + 2 class references |
| Inline hardcoded hex values    | 8 (index ×2, Cursor ×5, Nav ×1) | 3 (Cursor ×3, untouched)     |
| Dead component files           | 2 (Logo, BlueprintFrame)        | 0                            |
| Unused props                   | 1 (bodyClass)                   | 0                            |
| Heading levels (index.astro)   | h1, h3                          | h1, h2, h3                   |
| Skip link                      | absent                          | present                      |

All CI gates (`format:check`, `lint`, `lint:a11y:strict`, `astro check`, `build`) must pass at each commit.
