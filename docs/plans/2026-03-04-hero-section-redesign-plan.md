# Hero Section Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a value hook tagline, replace the revision block with a secondary CTA, and expand the name wordmark to the full name — all within the existing blueprint aesthetic.

**Architecture:** Three isolated edits to `src/pages/index.astro`. No new components, no new files. Each change is independent and can be committed separately.

**Tech Stack:** Astro 5, Tailwind v4 (utility classes), Barlow Condensed 700 (`font-display`), Space Mono 400 (`font-mono`)

---

## Baseline

Before touching anything, verify the build is clean:

```bash
npm run build
```

Expected: exits 0, no errors or warnings. If it fails, stop and resolve before proceeding.

---

## Task 1: Two-Line Name Wordmark

**File:** `src/pages/index.astro`

The `<h1>` currently renders `TRAVIS` as a single text node at `18vw`. We need two `<span>` blocks inside it — first name large, surname sized to approximate the same rendered width.

**Step 1: Locate the current h1**

In `src/pages/index.astro`, find lines ~22–27:

```astro
<h1
  class="font-display text-[18vw] text-bp-text select-none"
  style="line-height: 0.88;"
>
  TRAVIS
</h1>
```

**Step 2: Replace with two-span structure**

```astro
<h1
  class="font-display text-bp-text select-none"
  style="line-height: 0.88;"
>
  <span class="block text-[18vw]">TRAVIS</span>
  <span class="block text-[7vw]">WINDSOR-CUMMINGS</span>
</h1>
```

Notes:
- `text-[18vw]` moves from the `<h1>` to the first `<span>` — same size as before
- `text-[7vw]` on the second span approximates the rendered width of "TRAVIS" at 18vw for Barlow Condensed (6 chars vs 15 chars — ratio ~0.4)
- `block` on each span forces each onto its own line within the tight `line-height: 0.88`
- The `font-display`, `text-bp-text`, and `select-none` stay on the `<h1>` and inherit down

**Step 3: Run dev server and visually verify**

```bash
npm run dev
```

Open `http://localhost:4321`. Check:
- [ ] "TRAVIS" appears large, "WINDSOR-CUMMINGS" appears below it, smaller
- [ ] Both lines read as a single nameplate unit (tight, no excessive gap)
- [ ] No horizontal overflow on desktop (1280px+) or mobile (375px)
- [ ] If "WINDSOR-CUMMINGS" overflows on small screens, adjust to `text-[6.5vw]` or `text-[6vw]`

**Step 4: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: expand hero wordmark to full name TRAVIS WINDSOR-CUMMINGS"
```

---

## Task 2: Inject Tagline Element

**File:** `src/pages/index.astro`

Add `FIELD TESTED. BUILT DIFFERENTLY.` between the subtitle mono line and the two-column data block. This is the value hook — it answers "why should I care?" before the visitor reaches the CTA.

**Step 1: Locate the subtitle and data block boundary**

Find lines ~43–55 in `src/pages/index.astro`:

```astro
<!-- Subtitle -->
<p
  class="font-mono text-[11px] tracking-widest uppercase text-bp-steel"
  data-animate="fade"
  data-animate-delay="500"
>
  SOFTWARE ENGINEER — MEMPHIS GRIZZLIES — MEMPHIS, TN
</p>

<!-- Data block: text/action left, headshot right -->
<div
  class="flex flex-col md:flex-row md:items-start md:justify-between gap-8 md:gap-16 mt-4 md:mt-6"
>
```

**Step 2: Insert tagline between subtitle `</p>` and data block `<div>`**

```astro
<!-- Subtitle -->
<p
  class="font-mono text-[11px] tracking-widest uppercase text-bp-steel"
  data-animate="fade"
  data-animate-delay="500"
>
  SOFTWARE ENGINEER — MEMPHIS GRIZZLIES — MEMPHIS, TN
</p>

<!-- Tagline -->
<p
  class="font-display text-2xl md:text-3xl text-bp-text tracking-widest"
  data-animate="fade"
  data-animate-delay="800"
>
  FIELD TESTED. BUILT DIFFERENTLY.
</p>

<!-- Data block: text/action left, headshot right -->
<div
  class="flex flex-col md:flex-row md:items-start md:justify-between gap-8 md:gap-16 mt-4 md:mt-6"
>
```

Notes:
- `font-display` = Barlow Condensed 700 — same typeface as the wordmark, creates hierarchy
- `text-2xl md:text-3xl` = `1.5rem` / `1.875rem` — prominent but clearly secondary to the 18vw name
- `text-bp-text` (`#F2EDE6`) — does not compete with the amber CTA button
- `tracking-widest` — matches the mono metadata lines for consistent spacing rhythm
- `data-animate-delay="800"` — slots into the gap between the datum line (700ms) and the CTA (1000ms)

**Step 3: Visually verify**

```bash
npm run dev
```

Check:
- [ ] Tagline appears between subtitle line and the CTA/headshot columns
- [ ] Typography hierarchy reads: massive name → tiny mono facts → medium display tagline → CTA
- [ ] `800ms` delay means tagline fades in after the datum line draws
- [ ] No layout shift or overflow on mobile

**Step 4: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: add value hook tagline to hero section"
```

---

## Task 3: Replace Revision Block with Secondary CTA

**File:** `src/pages/index.astro`

Remove the `DRAWN BY / DATE / REV` revision block. Replace it with a bare `CONTACT →` text link. `id="contact"` already exists on the ContactForm section — the anchor will resolve correctly.

**Step 1: Locate the revision block**

Find lines ~69–88 in `src/pages/index.astro`:

```astro
<!-- Revision block — always visible (blueprint title-block style) -->
<div
  class="font-mono text-xs text-bp-steel tracking-widest leading-6 border border-bp-border p-4"
  aria-label="About"
  data-animate="fade"
  data-animate-delay="1200"
>
  <div>
    <span class="text-bp-text">DRAWN BY</span>&nbsp;&nbsp;T.
    WINDSOR-CUMMINGS
  </div>
  <div>
    <span class="text-bp-text">DATE</span
    >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2026
  </div>
  <div>
    <span class="text-bp-text">REV</span
    >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;CURRENT
  </div>
</div>
```

**Step 2: Replace with secondary CTA**

```astro
<!-- Secondary CTA -->
<a
  href="/#contact"
  class="font-mono text-xs tracking-widest text-bp-amber hover:text-bp-text transition-colors duration-200"
  data-animate="fade"
  data-animate-delay="1200"
>
  CONTACT →
</a>
```

Notes:
- Bare text link, no button chrome — intentionally subordinate to the primary amber button above it
- `text-bp-amber` at rest, `text-bp-text` on hover — reverses the primary button's color logic
- `data-animate-delay="1200"` unchanged — same slot as the revision block it replaces
- `href="/#contact"` scrolls to the ContactForm section (confirmed `id="contact"` exists there)

**Step 3: Visually verify**

```bash
npm run dev
```

Check:
- [ ] Revision block is gone
- [ ] "CONTACT →" appears below the "VIEW RECORD →" button
- [ ] Clicking "CONTACT →" scrolls to the contact form
- [ ] Hover state: amber → warm white transition at 200ms
- [ ] Left column still vertically balanced against headshot on the right

**Step 4: Run full CI gate**

```bash
npm run ci
```

Expected: format:check + lint + lint:a11y:strict + build all pass. If any fail, fix before committing.

**Step 5: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: replace revision block with secondary CONTACT CTA in hero"
```

---

## Done

All three tasks complete. The hero now:
1. Displays full name `TRAVIS / WINDSOR-CUMMINGS` as a two-line nameplate
2. Plants the value hook `FIELD TESTED. BUILT DIFFERENTLY.` before the CTA
3. Offers `CONTACT →` as a lightweight secondary action beside `VIEW RECORD →`
