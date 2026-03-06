# Blueprint Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the generic dark-mode teal portfolio with a world-class "Blueprint" design — warm dark concrete base, amber/steel accent palette, engineering-grid texture, Barlow Condensed + Space Mono typography, scroll-driven reveals, and custom cursor.

**Architecture:** All changes are to existing `.astro` components and CSS — no new pages, no framework added. Two new shared components (`BracketHeader.astro`, `BlueprintFrame.astro`) are created to keep blueprint patterns DRY. Scroll animations use a single `IntersectionObserver` in Layout.astro. Custom cursor is a standalone `Cursor.astro`.

**Tech Stack:** Astro 5, Tailwind CSS v4 (via `@tailwindcss/vite`), vanilla JS only, Netlify forms.

**Design reference:** `docs/plans/2026-02-27-blueprint-redesign-design.md`

**Verification after every task:** `npm run build` must pass. Run `npm run lint:a11y` after any component touching interactive elements.

---

## Task 1: Update Fonts and Tailwind Config

**Files:**
- Modify: `tailwind.config.mjs`
- Modify: `src/layouts/Layout.astro`

**Step 1: Replace Google Fonts URL in Layout.astro**

Find the existing `<link>` tag loading Overpass/Playfair/etc. Replace the entire font link with:

```html
<link
  href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700&family=Space+Mono&display=swap"
  rel="stylesheet"
/>
```

**Step 2: Update `tailwind.config.mjs`**

Replace the entire file:

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Barlow Condensed"', 'sans-serif'],
        mono: ['"Space Mono"', 'monospace'],
      },
      colors: {
        bp: {
          bg: '#0b0e11',
          card: '#111518',
          border: '#1E2730',
          amber: '#C9901A',
          'amber-light': '#E5A82A',
          steel: '#6B9FC8',
          text: '#F2EDE6',
        },
      },
      animation: {
        'slide-delay-1': 'slidein 0.3s ease-in-out 1 .08s both',
        'slide-delay-2': 'slidein 0.3s ease-in-out 1 .16s both',
        'slide-delay-3': 'slidein 0.3s ease-in-out 1 .24s both',
        'slide-delay-4': 'slidein 0.3s ease-in-out 1 .32s both',
        'slide-delay-5': 'slidein 0.3s ease-in-out 1 .40s both',
        slideout: 'slideout 0.3s ease-in-out 1 both',
      },
      keyframes: {
        slidein: {
          from: { translate: '-100%' },
          to: { translate: '0' },
        },
        slideout: {
          from: { translate: '0' },
          to: { translate: '-100%' },
        },
      },
    },
  },
  plugins: [],
}
```

**Step 3: Verify**

```bash
npm run build
```

Expected: build passes, no type errors.

**Step 4: Commit**

```bash
git add tailwind.config.mjs src/layouts/Layout.astro
git commit -m "feat: swap fonts to Barlow Condensed + Space Mono, add blueprint color tokens"
```

---

## Task 2: Foundation CSS — Grid Texture and Base Styles

**Files:**
- Modify: `src/styles/global.css`

**Step 1: Replace entire `global.css` with:**

```css
@config '../../tailwind.config.mjs';
@import 'tailwindcss';

/* ── Blueprint grid texture ───────────────────────────── */
body {
  background-color: #0b0e11;
  background-image:
    repeating-linear-gradient(rgba(255, 255, 255, 0.03) 0 1px, transparent 1px 40px),
    repeating-linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.03) 0 1px,
      transparent 1px 40px
    );
  background-size: 40px 40px;
  background-attachment: fixed;
  color: #f2ede6;
}

/* ── Scroll reveal animations ─────────────────────────── */
[data-animate] {
  opacity: 0;
  clip-path: inset(0 0 100% 0);
  transition:
    clip-path 600ms cubic-bezier(0.16, 1, 0.3, 1),
    opacity 400ms ease-out;
}

[data-animate][data-visible] {
  opacity: 1;
  clip-path: inset(0 0 0% 0);
}

[data-animate='fade'] {
  clip-path: none;
}
[data-animate='fade'][data-visible] {
  opacity: 1;
}

[data-animate='from-left'] {
  clip-path: inset(0 100% 0 0);
}
[data-animate='from-left'][data-visible] {
  clip-path: inset(0 0% 0 0);
}

[data-animate='from-right'] {
  clip-path: inset(0 0 0 100%);
}
[data-animate='from-right'][data-visible] {
  clip-path: inset(0 0 0 0%);
}

/* ── Bracket header line draw ─────────────────────────── */
.bracket-line {
  width: 0;
  transition: width 600ms cubic-bezier(0.16, 1, 0.3, 1);
}
.bracket-line.line-visible {
  width: 100%;
}

/* ── Build log amber margin line ──────────────────────── */
.build-log-line {
  height: 0;
  transition: height 1.5s ease-out;
}
.build-log-line.line-visible {
  height: 100%;
}

/* ── Navigation ───────────────────────────────────────── */
.nav-link {
  translate: -100%;
}

.slideIn {
  translate: 0;
  animation: slidein 0.3s ease-in-out 1 var(--slide-delay, 0.08s) both;
}

.slideOut {
  translate: -100%;
  animation: slideout 0.3s ease-in-out 1 both;
}

@keyframes slidein {
  from {
    translate: -100%;
  }
  to {
    translate: 0;
  }
}

@keyframes slideout {
  from {
    translate: 0;
  }
  to {
    translate: -100%;
  }
}

.navOpen {
  transform: translateX(0);
}

.hamActive .hamburger-bar:nth-child(1) {
  transform: translateY(8px) rotate(-45deg);
}
.hamActive .hamburger-bar:nth-child(2) {
  opacity: 0;
}
.hamActive .hamburger-bar:nth-child(3) {
  transform: translateY(-8px) rotate(45deg);
}

/* ── Custom cursor ────────────────────────────────────── */
#bp-cursor {
  pointer-events: none;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  transform: translate(-50%, -50%);
}

/* ── Amber underline draw on nav links ────────────────── */
.nav-text-link {
  position: relative;
}
.nav-text-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 1px;
  background-color: #c9901a;
  transition: width 200ms ease-out;
}
.nav-text-link:hover::after,
.nav-text-link[aria-current='page']::after {
  width: 100%;
}

/* ── Button hover sweep ───────────────────────────────── */
.btn-transmit {
  position: relative;
  overflow: hidden;
  isolation: isolate;
}
.btn-transmit::before {
  content: '';
  position: absolute;
  inset: 0;
  background: #6b9fc8;
  transform: translateX(100%);
  transition: transform 300ms ease-out;
  z-index: -1;
}
.btn-transmit:hover::before {
  transform: translateX(0);
}

/* ── Print styles ─────────────────────────────────────── */
@media print {
  body {
    background: white !important;
    background-image: none !important;
    color: black !important;
  }
  #bp-cursor,
  header,
  nav {
    display: none !important;
  }
  footer {
    position: static !important;
  }
  [data-animate] {
    opacity: 1 !important;
    clip-path: none !important;
  }
}

/* ── Reduced motion ───────────────────────────────────── */
@media (prefers-reduced-motion: reduce) {
  [data-animate] {
    clip-path: none;
    transition: opacity 300ms ease-out;
  }
  .bracket-line {
    width: 100%;
    transition: none;
  }
  .build-log-line {
    height: 100%;
    transition: none;
  }
  #bp-cursor {
    display: none;
  }
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

**Step 2: Verify**

```bash
npm run build
```

Expected: build passes.

**Step 3: Commit**

```bash
git add src/styles/global.css
git commit -m "feat: add blueprint grid texture, scroll-reveal utilities, base palette CSS"
```

---

## Task 3: Create Reusable Blueprint Components

**Files:**
- Create: `src/components/blueprint/BracketHeader.astro`
- Create: `src/components/blueprint/BlueprintFrame.astro`

**Step 1: Create `src/components/blueprint/BracketHeader.astro`**

```astro
---
interface Props {
  title: string
  meta?: string
  class?: string
}

const { title, meta = '', class: className = '' } = Astro.props
---

<div class:list={['flex items-center gap-0 w-full font-mono text-xs tracking-widest overflow-hidden', className]}>
  <span class="text-bp-amber shrink-0">[&nbsp;&nbsp;</span>
  <span class="text-bp-text uppercase shrink-0">{title}</span>
  <span
    class="bracket-line mx-3 inline-block h-px bg-bp-border shrink"
    style="min-width: 2rem; flex: 1;"
    aria-hidden="true"
  ></span>
  {meta && <span class="text-bp-steel shrink-0 uppercase">{meta}</span>}
  <span class="text-bp-amber shrink-0">&nbsp;&nbsp;]</span>
</div>
```

**Step 2: Create `src/components/blueprint/BlueprintFrame.astro`**

This wraps any content with amber corner tick marks — used for skill cards, logo frames, headshot, form fields.

```astro
---
interface Props {
  class?: string
  tickSize?: string
}

const { class: className = '', tickSize = 'w-3 h-3' } = Astro.props
---

<div class:list={['relative', className]}>
  <!-- Corner ticks -->
  <span
    class:list={['absolute top-0 left-0 border-t-2 border-l-2 border-bp-amber -translate-x-px -translate-y-px transition-all duration-150', tickSize]}
    aria-hidden="true"
  ></span>
  <span
    class:list={['absolute top-0 right-0 border-t-2 border-r-2 border-bp-amber translate-x-px -translate-y-px transition-all duration-150', tickSize]}
    aria-hidden="true"
  ></span>
  <span
    class:list={['absolute bottom-0 left-0 border-b-2 border-l-2 border-bp-amber -translate-x-px translate-y-px transition-all duration-150', tickSize]}
    aria-hidden="true"
  ></span>
  <span
    class:list={['absolute bottom-0 right-0 border-b-2 border-r-2 border-bp-amber translate-x-px translate-y-px transition-all duration-150', tickSize]}
    aria-hidden="true"
  ></span>
  <slot />
</div>
```

**Step 3: Verify**

```bash
npm run typecheck
```

Expected: no errors.

**Step 4: Commit**

```bash
git add src/components/blueprint/
git commit -m "feat: add BracketHeader and BlueprintFrame reusable blueprint components"
```

---

## Task 4: Redesign Navigation

**Files:**
- Modify: `src/components/Navigation.astro`

**Step 1: Replace the entire file with:**

```astro
---
import Icon from './Icon.astro'
import { SOCIAL_LINKS } from '../config/site'

const NAV_ITEMS = [
  { label: 'Story', href: '/#story', ariaLabel: 'My Story' },
  { label: 'Skills', href: '/#skills', ariaLabel: 'Skills' },
  { label: 'Résumé', href: '/resume', ariaLabel: 'Resume' },
  { label: 'Contact', href: '/#contact', ariaLabel: 'Contact' },
] as const
---

<!-- Desktop + Mobile header bar -->
<header
  class="fixed top-0 z-40 flex items-center justify-center w-full h-14 px-6 border-b border-bp-border"
  style="background: rgba(11,14,17,0.85); backdrop-filter: blur(8px);"
>
  <div class="flex items-center w-full max-w-screen-xl">

    <!-- Logo / initials -->
    <a
      href="/"
      class="font-display text-2xl text-bp-text tracking-widest hover:text-bp-amber transition-colors duration-200"
      aria-label="Home — Travis Windsor-Cummings"
    >
      TWC
    </a>

    <!-- Desktop nav links -->
    <nav aria-label="Primary navigation" class="hidden md:flex items-center gap-8 ml-auto">
      {NAV_ITEMS.map((item) => (
        <a
          href={item.href}
          aria-label={item.ariaLabel}
          class="nav-text-link font-mono text-xs tracking-widest uppercase text-bp-text hover:text-bp-amber transition-colors duration-200 pb-px"
        >
          {item.label}
        </a>
      ))}
    </nav>

    <!-- Mobile hamburger -->
    <div
      id="hamburger"
      role="button"
      tabindex="0"
      aria-label="Toggle navigation menu"
      aria-expanded="false"
      class="z-50 flex flex-col items-center justify-center w-8 h-8 ml-auto md:hidden cursor-pointer gap-2"
    >
      <div class="hamburger-bar w-6 h-px bg-bp-text transition-all duration-300 origin-center"></div>
      <div class="hamburger-bar w-6 h-px bg-bp-text transition-all duration-300"></div>
      <div class="hamburger-bar w-6 h-px bg-bp-text transition-all duration-300 origin-center"></div>
    </div>

  </div>
</header>

<!-- Mobile nav overlay -->
<div
  id="nav-menu"
  class="fixed top-0 left-0 z-40 w-full h-screen transition-transform duration-500 ease-in-out -translate-x-full"
  style="background-color: #0b0e11; background-image: repeating-linear-gradient(rgba(255,255,255,0.03) 0 1px, transparent 1px 40px), repeating-linear-gradient(90deg, rgba(255,255,255,0.03) 0 1px, transparent 1px 40px); background-size: 40px 40px;"
  aria-hidden="true"
>
  <nav class="flex flex-col justify-center h-full px-10 pt-14" aria-label="Mobile navigation">
    {NAV_ITEMS.map((item, index) => (
      <a
        href={item.href}
        class:list={[
          'nav-link flex items-baseline gap-4 py-5 border-b border-bp-border',
          index === 0 && 'border-t',
        ]}
        aria-label={item.ariaLabel}
      >
        <span class="font-mono text-xs text-bp-steel tracking-widest">0{index + 1} —</span>
        <span class="font-display text-5xl text-bp-text hover:text-bp-amber transition-colors duration-200">
          {item.label}
        </span>
      </a>
    ))}

    <!-- Social links -->
    <div class="flex gap-6 mt-10">
      {SOCIAL_LINKS.map((link) => (
        <a
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          class="w-6 h-6 text-bp-steel hover:text-bp-amber transition-colors duration-200"
          aria-label={link.label}
        >
          <Icon type={link.icon} class="w-full h-full" />
        </a>
      ))}
    </div>
  </nav>
</div>

<script>
  let isOpen = false
  const hamburger = document.getElementById('hamburger')
  const navMenu = document.getElementById('nav-menu')
  const navLinks = document.querySelectorAll<HTMLElement>('.nav-link')

  function animateNavLinksIn() {
    navLinks.forEach((link, index) => {
      link.classList.remove('slideOut')
      link.style.setProperty('--slide-delay', `${(index + 1) * 0.08}s`)
      link.classList.add('slideIn')
    })
  }

  function animateNavLinksOut() {
    navLinks.forEach((link) => {
      link.classList.remove('slideIn')
      link.classList.add('slideOut')
      link.style.removeProperty('--slide-delay')
    })
  }

  function toggleNav() {
    isOpen = !isOpen
    hamburger?.setAttribute('aria-expanded', String(isOpen))
    navMenu?.setAttribute('aria-hidden', String(!isOpen))

    if (isOpen) {
      hamburger?.classList.add('hamActive')
      navMenu?.classList.add('navOpen')
      animateNavLinksIn()
    } else {
      hamburger?.classList.remove('hamActive')
      navMenu?.classList.remove('navOpen')
      animateNavLinksOut()
    }
  }

  hamburger?.addEventListener('click', toggleNav)
  hamburger?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleNav() }
  })
  navMenu?.addEventListener('click', (e) => {
    if (e.target === navMenu && isOpen) toggleNav()
  })

  // Close on nav link click (mobile)
  navLinks.forEach((link) => {
    link.addEventListener('click', () => { if (isOpen) toggleNav() })
  })
</script>
```

**Step 2: Verify**

```bash
npm run build && npm run lint:a11y
```

Expected: build passes, no a11y errors.

**Step 3: Commit**

```bash
git add src/components/Navigation.astro
git commit -m "feat: redesign navigation with desktop text links and blueprint mobile overlay"
```

---

## Task 5: Create Custom Cursor and Update Layout Shell

**Files:**
- Create: `src/components/Cursor.astro`
- Modify: `src/layouts/Layout.astro`

**Step 1: Create `src/components/Cursor.astro`**

```astro
---
---
<!-- Blueprint registration-mark cursor (desktop only) -->
<div
  id="bp-cursor"
  aria-hidden="true"
  style="width: 20px; height: 20px;"
>
  <svg
    id="bp-cursor-svg"
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style="overflow: visible; transition: width 150ms ease-out, height 150ms ease-out;"
  >
    <!-- Circle -->
    <circle cx="10" cy="10" r="4" stroke="#C9901A" stroke-width="1.5" />
    <!-- Top tick -->
    <line x1="10" y1="0" x2="10" y2="5" stroke="#C9901A" stroke-width="1.5" />
    <!-- Bottom tick -->
    <line x1="10" y1="15" x2="10" y2="20" stroke="#C9901A" stroke-width="1.5" />
    <!-- Left tick -->
    <line x1="0" y1="10" x2="5" y2="10" stroke="#C9901A" stroke-width="1.5" />
    <!-- Right tick -->
    <line x1="15" y1="10" x2="20" y2="10" stroke="#C9901A" stroke-width="1.5" />
  </svg>
</div>

<script>
  const cursor = document.getElementById('bp-cursor')
  const svg = document.getElementById('bp-cursor-svg')

  if (cursor && svg && window.matchMedia('(pointer: fine)').matches) {
    let mouseX = window.innerWidth / 2
    let mouseY = window.innerHeight / 2
    let curX = mouseX
    let curY = mouseY
    let hovering = false

    document.body.style.cursor = 'none'

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
    })

    document.querySelectorAll('a, button, input, textarea, select, [role="button"], label').forEach((el) => {
      el.addEventListener('mouseenter', () => {
        hovering = true
        svg.setAttribute('width', '32')
        svg.setAttribute('height', '32')
        svg.setAttribute('viewBox', '0 0 32 32')
      })
      el.addEventListener('mouseleave', () => {
        hovering = false
        svg.setAttribute('width', '20')
        svg.setAttribute('height', '20')
        svg.setAttribute('viewBox', '0 0 20 20')
      })
    })

    function lerp(a: number, b: number, t: number) {
      return a + (b - a) * t
    }

    function tick() {
      curX = lerp(curX, mouseX, 0.14)
      curY = lerp(curY, mouseY, 0.14)
      cursor.style.left = curX + 'px'
      cursor.style.top = curY + 'px'
      requestAnimationFrame(tick)
    }

    tick()
  }
</script>
```

**Step 2: Update `src/layouts/Layout.astro`**

Import Cursor and add to body. Also update `<main>` — remove `bg-gray-950`, keep `pt-14` (new nav height). Remove `mb-32` (footer is no longer fixed).

```astro
---
import '../styles/global.css'
import Navigation from '../components/Navigation.astro'
import Footer from '../components/Footer.astro'
import SeoHead from '../components/seo/SeoHead.astro'
import Cursor from '../components/Cursor.astro'

interface Props {
  title?: string
  description?: string
}

const { title, description } = Astro.props
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="icon" type="image/x-icon" href="/favicon.ico" />
    <SeoHead title={title} description={description} />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700&family=Space+Mono&display=swap"
      rel="stylesheet"
    />
    <meta name="generator" content={Astro.generator} />
  </head>
  <body>
    <Cursor />
    <Navigation />
    <main class="relative z-10 pt-14">
      <slot />
    </main>
    <Footer />

    <!-- Scroll reveal IntersectionObserver -->
    <script>
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const el = entry.target as HTMLElement
              const delay = el.dataset.animateDelay ?? '0'
              setTimeout(() => {
                el.setAttribute('data-visible', '')
              }, parseInt(delay))
              observer.unobserve(el)
            }
          })
        },
        { threshold: 0.12 }
      )

      document.querySelectorAll('[data-animate]').forEach((el) => observer.observe(el))

      // Bracket header line observer
      const lineObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('line-visible')
              lineObserver.unobserve(entry.target)
            }
          })
        },
        { threshold: 0.5 }
      )

      document.querySelectorAll('.bracket-line, .build-log-line').forEach((el) => lineObserver.observe(el))
    </script>
  </body>
</html>
```

**Step 3: Verify**

```bash
npm run build
```

Expected: build passes.

**Step 4: Commit**

```bash
git add src/components/Cursor.astro src/layouts/Layout.astro
git commit -m "feat: add blueprint registration-mark cursor, update layout shell"
```

---

## Task 6: Redesign Hero Section

**Files:**
- Modify: `src/pages/index.astro` (hero `<section>` only — leave Story/Skills/Contact for later tasks)

**Step 1: Replace the hero `<section>` (lines 10–62) with:**

```astro
<!-- Hero -->
<section
  class="relative flex items-center min-h-screen px-6 pt-14 pb-24 md:px-12 overflow-hidden"
  aria-label="Introduction"
>
  <div class="w-full max-w-screen-xl mx-auto">

    <!-- TRAVIS wordmark -->
    <div class="relative mb-6" data-animate="fade" data-animate-delay="200">
      <h1
        class="font-display text-[18vw] leading-none tracking-tight text-bp-text select-none"
        style="line-height: 0.9;"
      >
        TRAVIS
      </h1>

      <!-- Dashed amber annotation line -->
      <div
        class="absolute top-1/2 right-0 flex items-center gap-2 -translate-y-8"
        aria-hidden="true"
        data-animate="from-right"
        data-animate-delay="900"
      >
        <span
          class="block h-px w-24 md:w-40"
          style="border-top: 1px dashed #C9901A;"
        ></span>
        <span class="font-mono text-xs text-bp-amber tracking-widest">[ v2.0 ]</span>
      </div>
    </div>

    <!-- Subtitle row -->
    <p
      class="font-mono text-xs tracking-widest uppercase text-bp-steel mb-12 md:mb-16"
      data-animate="fade"
      data-animate-delay="500"
    >
      SOFTWARE ENGINEER — MEMPHIS GRIZZLIES — MEMPHIS, TN
    </p>

    <!-- Two-column: headshot + right panel -->
    <div class="flex flex-col gap-12 md:flex-row md:items-start md:justify-between">

      <!-- Headshot in blueprint frame -->
      <div
        class="relative inline-block"
        data-animate="fade"
        data-animate-delay="1000"
      >
        <!-- BlueprintFrame wrapper — inline here for load sequence control -->
        <div class="relative border border-bp-border p-1">
          <!-- Corner ticks -->
          <span class="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-bp-amber -translate-x-px -translate-y-px" aria-hidden="true"></span>
          <span class="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-bp-amber translate-x-px -translate-y-px" aria-hidden="true"></span>
          <span class="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-bp-amber -translate-x-px translate-y-px" aria-hidden="true"></span>
          <span class="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-bp-amber translate-x-px translate-y-px" aria-hidden="true"></span>
          <img
            src="/images/travis_headshot.webp"
            alt="Travis Windsor-Cummings"
            class="block w-48 md:w-56"
            width="224"
            height="224"
          />
        </div>
        <!-- Annotation label -->
        <div class="flex items-center gap-2 mt-2" aria-hidden="true">
          <span class="block h-px w-6" style="border-top: 1px solid #C9901A;"></span>
          <span class="font-mono text-xs text-bp-amber tracking-widest">SUBJECT</span>
        </div>
      </div>

      <!-- Right: CTA + revision block -->
      <div class="flex flex-col gap-8 md:text-right md:items-end">

        <!-- Memphis coordinates -->
        <div
          class="font-mono text-xs text-bp-steel tracking-widest"
          aria-hidden="true"
          data-animate="fade"
          data-animate-delay="700"
        >
          35°08'N 90°02'W
        </div>

        <!-- CTA -->
        <div data-animate="fade" data-animate-delay="1200">
          <a
            href="/resume"
            class="inline-block px-8 py-3 font-display text-xl tracking-widest text-bp-bg border-2 border-bp-amber bg-bp-amber hover:bg-transparent hover:text-bp-amber transition-colors duration-300"
          >
            VIEW RECORD →
          </a>
        </div>

        <!-- Revision block -->
        <div
          class="font-mono text-xs text-bp-steel tracking-widest leading-6 border border-bp-border p-4 text-left"
          aria-label="About"
          data-animate="fade"
          data-animate-delay="1300"
        >
          <div><span class="text-bp-text">DRAWN BY</span>   T. WINDSOR-CUMMINGS</div>
          <div><span class="text-bp-text">DATE</span>       2026</div>
          <div><span class="text-bp-text">REV</span>        CURRENT</div>
        </div>

        <!-- Scroll prompt -->
        <a
          href="#story"
          class="font-mono text-xs text-bp-border tracking-widest hover:text-bp-steel transition-colors duration-200"
          data-animate="fade"
          data-animate-delay="1400"
        >
          ↓ scroll to begin
        </a>
      </div>
    </div>

  </div>
</section>
```

**Step 2: Verify**

```bash
npm run build && npm run lint:a11y
```

Expected: build passes, no critical a11y errors.

**Step 3: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: redesign hero with full-width TRAVIS wordmark, blueprint frame headshot, annotation elements"
```

---

## Task 7: Redesign CareerTimeline — Build Log

**Files:**
- Modify: `src/components/CareerTimeline.astro`

**Step 1: Replace entire file with:**

```astro
---
import BracketHeader from './blueprint/BracketHeader.astro'

const milestones = [
  {
    date: 'MEMPHIS, TN',
    title: 'Memphis Roots',
    description: 'Born and raised in Memphis. The city shaped my work ethic, my values, and my love of basketball — long before I knew any of that would matter.',
    type: 'ORIGIN',
    typeColor: 'amber',
  },
  {
    date: 'PRE-2010',
    title: 'Building Work Ethic',
    description: 'Restaurant kitchens, warehouse assembly lines, manual labor. Hard work in unglamorous conditions taught me how to show up every day and get things done — a foundation that still holds.',
    type: 'PRE-TECH',
    duration: 'MULTI-YR',
    typeColor: 'amber',
  },
  {
    date: '2010–2013',
    title: 'First Tech-Adjacent Role',
    description: 'As a Wire Technician for AT&T Uverse, I installed and maintained internet, TV, and phone services. My first real look at the technology infrastructure underneath everyday life.',
    type: 'TECH-ADJACENT',
    duration: '3 YRS',
    typeColor: 'amber',
  },
  {
    date: '2014–2019',
    title: 'Five Years on the Freight Yard',
    description: 'Hostler at Estes Express Lines — moving trailers with precision and focus. Stable, but restless. Started taking community college classes. Not sure where I was headed, just sure I wanted more.',
    type: 'PRE-TECH',
    duration: '5 YRS',
    typeColor: 'amber',
  },
  {
    date: 'SEP 2018',
    title: 'The Spark',
    description: "My oldest brother, already enrolled in Tech901's Code 1.0 bootcamp, invited me to join him. I said yes — and something clicked. I wasn't just learning to code. I discovered I genuinely loved solving these kinds of problems.",
    type: 'INFLECTION',
    typeColor: 'steel',
  },
  {
    date: 'JUL 2019',
    title: 'First Dev Role',
    description: 'After finishing Tech901 and sending out dozens of resumes, a connection reached out about a front-end developer role at Elite Deals. HTML, CSS, JavaScript, Vue.js, Laravel. Real skills, real systems.',
    type: 'CAREER',
    duration: '3 YRS',
    typeColor: 'steel',
  },
  {
    date: 'APR 2022',
    title: 'The Grizzlies Call',
    description: "A Tech901 instructor reached out and asked if I'd be interested in working for the Memphis Grizzlies. My hometown team. A lifelong basketball fan. I couldn't say no — and I haven't looked back.",
    type: 'CAREER',
    duration: 'PRESENT',
    typeColor: 'steel',
  },
]
---

<div class="w-full">
  <BracketHeader
    title="Build Log"
    meta="SUBJECT: T. WINDSOR-CUMMINGS"
    class="mb-12"
    data-animate="from-left"
  />

  <div class="relative">
    <!-- Amber margin line -->
    <div
      class="build-log-line absolute top-0 left-0 w-px bg-bp-amber md:left-[18%]"
      aria-hidden="true"
    ></div>

    <ol class="list-none p-0 m-0 space-y-0">
      {milestones.map((m, index) => (
        <li
          class="relative flex flex-col md:flex-row gap-0 md:gap-0 pb-12 last:pb-0"
          data-animate="fade"
          data-animate-delay={String(index * 80)}
        >
          <!-- Date column -->
          <div class="md:w-[18%] pl-4 md:pl-0 md:pr-8 md:text-right shrink-0 mb-2 md:mb-0">
            <span
              class:list={[
                'font-mono text-3xl md:text-4xl leading-none font-bold',
                m.typeColor === 'steel' ? 'text-bp-steel' : 'text-bp-amber',
              ]}
            >
              {m.date}
            </span>
          </div>

          <!-- Tick mark on the line -->
          <div
            class="hidden md:block absolute left-[18%] top-3 w-3 h-px bg-bp-amber"
            aria-hidden="true"
          ></div>

          <!-- Content column -->
          <div class="pl-8 md:pl-10 flex-1 border-l border-bp-border md:border-0">
            <h3 class="font-display text-2xl text-bp-text mb-2">{m.title}</h3>
            <p class="text-bp-text opacity-75 leading-relaxed text-sm md:text-base mb-3 max-w-2xl">
              {m.description}
            </p>
            <!-- Annotation tags -->
            <div class="flex gap-4 font-mono text-xs tracking-widest">
              <span class="text-bp-border">TYPE: <span class="text-bp-steel">{m.type}</span></span>
              {m.duration && (
                <span class="text-bp-border">DURATION: <span class="text-bp-steel">{m.duration}</span></span>
              )}
            </div>
          </div>
        </li>
      ))}
    </ol>
  </div>
</div>
```

**Step 2: Verify**

```bash
npm run build && npm run lint:a11y
```

**Step 3: Commit**

```bash
git add src/components/CareerTimeline.astro
git commit -m "feat: redesign CareerTimeline as blueprint build log with amber margin line"
```

---

## Task 8: Redesign Story Section Wrapper

**Files:**
- Modify: `src/pages/index.astro` (the `#story` section only)

**Step 1: Replace the `#story` section with:**

```astro
<!-- Story -->
<section
  id="story"
  class="px-6 py-32 md:px-12 md:py-40 border-t border-bp-border"
>
  <div class="max-w-screen-xl mx-auto">
    <p
      class="font-mono text-sm text-bp-steel tracking-widest mb-16 max-w-2xl opacity-75"
      data-animate="fade"
    >
      I didn't arrive at software engineering in a straight line. I took the
      long way around — through restaurants, warehouses, freight yards, and
      five years of showing up every day before I ever wrote a line of code.
      It turns out that was exactly the right path.
    </p>
    <CareerTimeline />
  </div>
</section>
```

**Step 2: Verify**

```bash
npm run build
```

**Step 3: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: update story section wrapper for blueprint layout"
```

---

## Task 9: Redesign Skills — Bill of Materials

**Files:**
- Modify: `src/components/Skills.astro`

**Step 1: Replace entire file with:**

```astro
---
import BracketHeader from './blueprint/BracketHeader.astro'
import Icon from './Icon.astro'

const skills = [
  {
    num: '01',
    icon: 'design',
    title: 'Designing',
    text: `Design is the difference between something that works and something that resonates. I care deeply about the experience behind every interface — from the layout of a landing page to the logic of a data-driven campaign. Good design isn't decoration; it's how you communicate.`,
    since: '2018',
  },
  {
    num: '02',
    icon: 'code',
    title: 'Coding',
    text: `Software engineering is how I solve problems for real people. At the Memphis Grizzlies, that means building and maintaining the systems behind ticketing, marketing, community, and live entertainment. I work across front-end development, Salesforce Marketing Cloud, and everything in between.`,
    since: '2018',
  },
  {
    num: '03',
    icon: 'maker',
    title: 'Making',
    text: `When I'm not building software, I'm building other things. My workshop has grown to include 3D printers, a Raspberry Pi, and a growing collection of tools for tinkering. Currently sourcing equipment for a home Plex server and NAS — because the making never stops.`,
    since: '2015',
  },
  {
    num: '04',
    icon: 'create',
    title: 'Creating',
    text: `Creating is a mindset, not a medium. Whether it's a web system that scales, a piece of furniture, or a solution no one else saw coming — I'm drawn to the act of making something out of nothing. Every problem is an invitation to build something better.`,
    since: '2010',
  },
] as const

// Vertical offsets for the asymmetric stagger
const offsets = ['mt-0', 'mt-8', 'mt-16', 'mt-4']
---

<section
  id="skills"
  class="px-6 py-32 md:px-12 md:py-40 border-t border-bp-border"
>
  <div class="max-w-screen-xl mx-auto">
    <BracketHeader
      title="Bill of Materials"
      meta="REV: CURRENT  QTY: 04"
      class="mb-16"
      data-animate="from-left"
    />

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
      {skills.map((skill, index) => (
        <div
          class:list={['group relative border border-bp-border p-8', offsets[index]]}
          style="background-color: #111518; background-image: repeating-linear-gradient(rgba(255,255,255,0.02) 0 1px, transparent 1px 40px), repeating-linear-gradient(90deg, rgba(255,255,255,0.02) 0 1px, transparent 1px 40px); background-size: 40px 40px;"
          data-animate={index % 2 === 0 ? 'from-left' : 'from-right'}
          data-animate-delay={String(index * 80)}
        >
          <!-- Corner ticks -->
          <span class="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-bp-amber -translate-x-px -translate-y-px transition-all duration-150 group-hover:w-4 group-hover:h-4" aria-hidden="true"></span>
          <span class="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-bp-amber translate-x-px -translate-y-px transition-all duration-150 group-hover:w-4 group-hover:h-4" aria-hidden="true"></span>
          <span class="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-bp-amber -translate-x-px translate-y-px transition-all duration-150 group-hover:w-4 group-hover:h-4" aria-hidden="true"></span>
          <span class="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-bp-amber translate-x-px translate-y-px transition-all duration-150 group-hover:w-4 group-hover:h-4" aria-hidden="true"></span>

          <!-- Watermark number -->
          <div
            class="absolute top-4 right-6 font-mono text-7xl font-bold text-bp-amber select-none pointer-events-none transition-opacity duration-150 group-hover:opacity-50"
            style="opacity: 0.15;"
            aria-hidden="true"
          >
            {skill.num}
          </div>

          <!-- Content -->
          <h3 class="font-display text-3xl text-bp-text mb-4 relative z-10">
            {skill.title}
          </h3>
          <p class="text-bp-text opacity-75 leading-relaxed text-sm relative z-10 mb-6">
            {skill.text}
          </p>
          <div class="font-mono text-xs tracking-widest text-bp-border relative z-10">
            STATUS: <span class="text-bp-steel">ACTIVE</span>
            {'  '}
            SINCE: <span class="text-bp-steel">{skill.since}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>
```

**Step 2: Verify**

```bash
npm run build && npm run lint:a11y
```

**Step 3: Commit**

```bash
git add src/components/Skills.astro
git commit -m "feat: redesign Skills as blueprint bill of materials with asymmetric 2x2 grid"
```

---

## Task 10: Redesign ContactForm — Transmission Panel

**Files:**
- Modify: `src/components/ContactForm.astro`

**Step 1: Replace entire file with:**

```astro
---
import BracketHeader from './blueprint/BracketHeader.astro'
import { SOCIAL_LINKS } from '../config/site'

const fieldClass =
  'group/field relative w-full'

const inputClass =
  'w-full px-4 py-3 font-mono text-sm text-bp-text bg-bp-card border border-bp-border outline-none focus:border-bp-amber transition-colors duration-200 placeholder:text-bp-border'
---

<section
  id="contact"
  class="px-6 py-32 md:px-12 md:py-40 border-t border-bp-border"
>
  <div class="max-w-screen-xl mx-auto">
    <BracketHeader
      title="Initiate Contact"
      meta="METHOD: DIRECT  STATUS: OPEN"
      class="mb-16"
      data-animate="from-left"
    />

    <div class="max-w-2xl">
      <form
        method="POST"
        name="contact"
        data-netlify="true"
        netlify-honeypot="bot-field"
        class="space-y-6"
      >
        <input type="hidden" name="form-name" value="contact" />
        <div class="hidden">
          <label>
            Don't fill this out if you're human:
            <input name="bot-field" type="text" autocomplete="off" tabindex="-1" />
          </label>
        </div>

        <!-- Name + Email row -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class={fieldClass} data-animate="from-left" data-animate-delay="100">
            <div class="relative border border-bp-border focus-within:border-bp-amber transition-colors duration-200">
              <!-- Corner ticks -->
              <span class="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-bp-amber -translate-x-px -translate-y-px" aria-hidden="true"></span>
              <span class="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-bp-amber translate-x-px -translate-y-px" aria-hidden="true"></span>
              <span class="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-bp-amber -translate-x-px translate-y-px" aria-hidden="true"></span>
              <span class="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-bp-amber translate-x-px translate-y-px" aria-hidden="true"></span>
              <div class="px-4 pt-3 pb-1">
                <label for="name" class="block font-mono text-xs tracking-widest text-bp-steel mb-1">// NAME</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autocomplete="name"
                  required
                  class="w-full bg-transparent text-bp-text text-sm outline-none pb-2 placeholder:text-bp-border"
                />
              </div>
            </div>
          </div>

          <div class={fieldClass} data-animate="from-left" data-animate-delay="200">
            <div class="relative border border-bp-border focus-within:border-bp-amber transition-colors duration-200">
              <span class="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-bp-amber -translate-x-px -translate-y-px" aria-hidden="true"></span>
              <span class="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-bp-amber translate-x-px -translate-y-px" aria-hidden="true"></span>
              <span class="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-bp-amber -translate-x-px translate-y-px" aria-hidden="true"></span>
              <span class="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-bp-amber translate-x-px translate-y-px" aria-hidden="true"></span>
              <div class="px-4 pt-3 pb-1">
                <label for="email" class="block font-mono text-xs tracking-widest text-bp-steel mb-1">// EMAIL</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  inputmode="email"
                  autocomplete="email"
                  required
                  class="w-full bg-transparent text-bp-text text-sm outline-none pb-2 placeholder:text-bp-border"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Subject -->
        <div data-animate="from-left" data-animate-delay="300">
          <div class="relative border border-bp-border focus-within:border-bp-amber transition-colors duration-200">
            <span class="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-bp-amber -translate-x-px -translate-y-px" aria-hidden="true"></span>
            <span class="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-bp-amber translate-x-px -translate-y-px" aria-hidden="true"></span>
            <span class="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-bp-amber -translate-x-px translate-y-px" aria-hidden="true"></span>
            <span class="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-bp-amber translate-x-px translate-y-px" aria-hidden="true"></span>
            <div class="px-4 pt-3 pb-1">
              <label for="subject" class="block font-mono text-xs tracking-widest text-bp-steel mb-1">// SUBJECT</label>
              <input
                id="subject"
                name="subject"
                type="text"
                autocomplete="off"
                required
                class="w-full bg-transparent text-bp-text text-sm outline-none pb-2"
              />
            </div>
          </div>
        </div>

        <!-- Message -->
        <div data-animate="from-left" data-animate-delay="400">
          <div class="relative border border-bp-border focus-within:border-bp-amber transition-colors duration-200">
            <span class="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-bp-amber -translate-x-px -translate-y-px" aria-hidden="true"></span>
            <span class="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-bp-amber translate-x-px -translate-y-px" aria-hidden="true"></span>
            <span class="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-bp-amber -translate-x-px translate-y-px" aria-hidden="true"></span>
            <span class="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-bp-amber translate-x-px translate-y-px" aria-hidden="true"></span>
            <div class="px-4 pt-3 pb-1">
              <label for="message" class="block font-mono text-xs tracking-widest text-bp-steel mb-1">// MESSAGE</label>
              <textarea
                id="message"
                name="message"
                autocomplete="off"
                required
                rows="6"
                class="w-full bg-transparent text-bp-text text-sm outline-none pb-2 resize-none"
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Submit -->
        <div class="flex justify-end" data-animate="fade" data-animate-delay="500">
          <button
            type="submit"
            class="btn-transmit font-display text-xl tracking-widest px-10 py-3 bg-bp-amber text-bp-bg border-2 border-bp-amber hover:text-bp-text transition-colors duration-300"
          >
            TRANSMIT →
          </button>
        </div>
      </form>

      <!-- Alternative channels -->
      <div class="mt-16 pt-8 border-t border-dashed border-bp-border" data-animate="fade" data-animate-delay="600">
        <p class="font-mono text-xs tracking-widest text-bp-border mb-4">// ALTERNATIVE CHANNELS ————————————————————</p>
        <div class="space-y-2">
          {SOCIAL_LINKS.map((link) => (
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              class="group flex items-center gap-3 font-mono text-xs tracking-widest text-bp-steel hover:text-bp-amber transition-colors duration-200"
              aria-label={link.label}
            >
              <span class="text-bp-amber transition-transform duration-150 group-hover:translate-x-1">→</span>
              <span class="uppercase w-16">{link.label}</span>
              <span class="text-bp-border">{link.href.replace('https://', '')}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  </div>
</section>
```

**Step 2: Verify**

```bash
npm run build && npm run lint:a11y
```

**Step 3: Commit**

```bash
git add src/components/ContactForm.astro
git commit -m "feat: redesign contact as blueprint transmission panel with // labels and TRANSMIT button"
```

---

## Task 11: Redesign Footer

**Files:**
- Modify: `src/components/Footer.astro`

**Step 1: Replace entire file with:**

```astro
---
import Icon from './Icon.astro'
import { SOCIAL_LINKS } from '../config/site'
---

<footer class="border-t border-bp-border px-6 py-10 md:px-12">
  <div class="max-w-screen-xl mx-auto">
    <!-- Bracket line -->
    <div class="flex items-center gap-0 w-full font-mono text-xs tracking-widest mb-6 overflow-hidden">
      <span class="text-bp-amber shrink-0">[&nbsp;&nbsp;</span>
      <span class="text-bp-text uppercase shrink-0">TWC</span>
      <span class="mx-3 inline-block h-px bg-bp-border flex-1" aria-hidden="true"></span>
      <span class="text-bp-steel shrink-0 uppercase">MEMPHIS, TN</span>
      <span class="mx-3 inline-block h-px bg-bp-border w-8" aria-hidden="true"></span>
      <span class="text-bp-steel shrink-0">&copy;{new Date().getFullYear()}</span>
      <span class="text-bp-amber shrink-0">&nbsp;&nbsp;]</span>
    </div>

    <!-- Social links -->
    <div class="flex gap-6">
      {SOCIAL_LINKS.map((link) => (
        <a
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          class="w-5 h-5 text-bp-border hover:text-bp-amber transition-colors duration-200"
          aria-label={link.label}
        >
          <Icon type={link.icon} class="w-full h-full" />
        </a>
      ))}
    </div>
  </div>
</footer>
```

**Step 2: Verify**

```bash
npm run build
```

**Step 3: Commit**

```bash
git add src/components/Footer.astro
git commit -m "feat: redesign footer as in-flow blueprint bracket, remove fixed positioning"
```

---

## Task 12: Redesign Résumé Page

**Files:**
- Modify: `src/pages/resume.astro`
- Modify: `src/components/resume/ResumeSection.astro`
- Modify: `src/components/resume/ResumeItem.astro`
- Modify: `src/components/resume/ResumeBulletList.astro`

**Step 1: Replace `src/components/resume/ResumeBulletList.astro`**

```astro
---
interface Props {
  bullets: string[]
}
const { bullets } = Astro.props
---

<ul class="mt-3 space-y-2 list-none p-0">
  {bullets.map((bullet) => (
    <li class="flex gap-3 text-sm text-bp-text opacity-75 leading-relaxed">
      <span class="text-bp-amber shrink-0 mt-px">→</span>
      <span>{bullet}</span>
    </li>
  ))}
</ul>
```

**Step 2: Replace `src/components/resume/ResumeItem.astro`**

```astro
---
import ResumeBulletList from './ResumeBulletList.astro'
import type { ResumeItemData } from '../../data/resume'

interface Props {
  item: ResumeItemData
}
const { item } = Astro.props
---

<div>
  <!-- Organization header -->
  <div class="flex flex-col sm:flex-row sm:items-start gap-4 mb-4">
    {item.logo && (
      <div class="relative inline-block shrink-0">
        <!-- Blueprint frame for logo -->
        <div class="relative border border-bp-border p-2">
          <span class="absolute top-0 left-0 w-2 h-2 border-t border-l border-bp-amber -translate-x-px -translate-y-px" aria-hidden="true"></span>
          <span class="absolute top-0 right-0 w-2 h-2 border-t border-r border-bp-amber translate-x-px -translate-y-px" aria-hidden="true"></span>
          <span class="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-bp-amber -translate-x-px translate-y-px" aria-hidden="true"></span>
          <span class="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-bp-amber translate-x-px translate-y-px" aria-hidden="true"></span>
          <img
            src={item.logo.src}
            alt={item.logo.alt}
            class="object-contain w-24 h-12"
          />
        </div>
      </div>
    )}
    <h3 class="font-display text-2xl text-bp-text">{item.organization}</h3>
  </div>

  {item.entries.map((entry, index) => (
    <div>
      {index > 0 && item.divideEntries && (
        <hr class="my-6 border-t border-dashed border-bp-border" />
      )}

      {(entry.role || entry.date) && (
        <div class="flex flex-wrap items-baseline gap-2 mb-2">
          {entry.role && (
            <span class:list={['font-mono text-sm text-bp-amber tracking-wide', entry.roleClass]}>
              {entry.role}
            </span>
          )}
          {entry.role && entry.date && (
            <span class="font-mono text-bp-border text-xs">—</span>
          )}
          {entry.date && (
            <span class:list={['font-mono text-xs text-bp-steel tracking-widest', entry.dateClass]}>
              {entry.date}
            </span>
          )}
        </div>
      )}

      {entry.description && (
        <p class:list={['text-sm text-bp-text opacity-75 leading-relaxed mb-2', entry.descriptionClass]}>
          {entry.description}
        </p>
      )}

      {entry.link && (
        <a
          href={entry.link.href}
          class="font-mono text-xs text-bp-steel hover:text-bp-amber transition-colors duration-200 underline"
        >
          {entry.link.label}
        </a>
      )}

      {entry.bullets && entry.bullets.length > 0 && (
        <ResumeBulletList bullets={entry.bullets} />
      )}
    </div>
  ))}
</div>
```

**Step 3: Replace `src/components/resume/ResumeSection.astro`**

```astro
---
import BracketHeader from '../blueprint/BracketHeader.astro'

interface Props {
  title: string
  bodyClass?: string
  entryCount?: number
}

const { title, entryCount } = Astro.props
const meta = entryCount ? `ENTRIES: 0${entryCount}` : ''
---

<section class="mb-16" data-animate="fade">
  <BracketHeader title={title} meta={meta} class="mb-8" />
  <div class="pt-2">
    <slot />
  </div>
</section>
```

**Step 4: Replace `src/pages/resume.astro`**

```astro
---
import Layout from '../layouts/Layout.astro'
import ResumeSection from '../components/resume/ResumeSection.astro'
import ResumeItem from '../components/resume/ResumeItem.astro'
import { RESUME_SECTIONS } from '../data/resume'
---

<Layout
  title="Resume"
  description="A current resume for Travis Windsor-Cummings"
>
  <div class="flex gap-0">

    <!-- Sidebar (desktop) -->
    <aside
      class="hidden lg:block w-56 shrink-0 sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto border-r border-bp-border px-6 py-10"
      aria-label="Resume sections"
    >
      <p class="font-mono text-xs tracking-widest text-bp-border mb-6 uppercase">Contents</p>
      <nav aria-label="Resume section navigation">
        <ul class="space-y-3 list-none p-0">
          {RESUME_SECTIONS.map((section, index) => (
            <li>
              <a
                href={`#resume-${section.title.toLowerCase().replace(/\s+/g, '-')}`}
                class="flex items-center gap-2 font-mono text-xs tracking-widest text-bp-border hover:text-bp-amber transition-colors duration-200 group"
              >
                <span class="text-bp-steel group-hover:text-bp-amber transition-colors duration-200">
                  0{index + 1}
                </span>
                <span class="uppercase">{section.title}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>

    <!-- Main content -->
    <main class="flex-1 px-6 py-10 md:px-12 max-w-4xl">
      <!-- Page header -->
      <div class="mb-16">
        <div class="flex items-center gap-0 w-full font-mono text-xs tracking-widest overflow-hidden mb-2">
          <span class="text-bp-amber shrink-0">[&nbsp;&nbsp;</span>
          <span class="text-bp-text uppercase shrink-0">Personnel File</span>
          <span class="mx-3 inline-block h-px bg-bp-border flex-1" aria-hidden="true"></span>
          <span class="text-bp-steel shrink-0 uppercase">Subject: T. Windsor-Cummings</span>
          <span class="text-bp-amber shrink-0">&nbsp;&nbsp;]</span>
        </div>
      </div>

      {RESUME_SECTIONS.map((section) => (
        <div id={`resume-${section.title.toLowerCase().replace(/\s+/g, '-')}`}>
          <ResumeSection
            title={section.title}
            entryCount={section.items.length}
          >
            {section.items.map((item, index) => (
              <>
                <ResumeItem item={item} />
                {index < section.items.length - 1 && (
                  <hr class="my-8 border-t border-dashed border-bp-border" />
                )}
              </>
            ))}
          </ResumeSection>
        </div>
      ))}
    </main>
  </div>
</Layout>
```

**Step 5: Update `src/data/resume.ts`** — Remove `bodyClass` from Certifications and Community Service sections (those were for the old border styles and are no longer needed):

In `resume.ts`, find the `Certifications` entry:
```ts
// Remove this line:
bodyClass: 'px-4 pt-8 pb-8 mb-8 border border-gray-200 rounded-b-sm md:px-8',
```

And the `Community Service` entry:
```ts
// Remove this line:
bodyClass: 'px-4 pt-8 pb-12 border border-gray-200 rounded-b-sm md:px-8',
```

**Step 6: Verify**

```bash
npm run build && npm run lint:a11y
```

**Step 7: Commit**

```bash
git add src/pages/resume.astro src/components/resume/ src/data/resume.ts
git commit -m "feat: redesign resume page as blueprint personnel file with sidebar navigation"
```

---

## Task 13: Final CI Gate and Cleanup

**Files:**
- Modify: `src/pages/index.astro` (verify Story section import still works with new components)
- Run full CI suite

**Step 1: Run the full CI gate**

```bash
npm run ci
```

This runs: `format:check` → `lint` → `lint:a11y:strict` → `build`

Expected: all pass. If `format:check` fails, run:
```bash
npm run format
git add -A
git commit -m "chore: auto-format after blueprint redesign"
```

If `lint:a11y:strict` flags issues, the most common to check:
- All `<img>` tags have descriptive `alt` attributes ✓ (already in plan)
- All form `<input>` elements have associated `<label>` ✓ (already in plan)
- All interactive elements are keyboard-accessible ✓ (nav hamburger has `tabindex="0"` and keydown handler)
- Color contrast: amber `#C9901A` on dark bg `#0b0e11` — verify contrast ratio ≥ 4.5:1 for text

**Step 2: Commit any fixes, then tag**

```bash
git add -A
git commit -m "feat: complete blueprint redesign — world-class design system implementation"
```

---

## Quick Reference: Blueprint Design Tokens

| Token | Value | Usage |
|---|---|---|
| `bp-bg` | `#0b0e11` | Page background |
| `bp-card` | `#111518` | Card / input backgrounds |
| `bp-border` | `#1E2730` | Borders, dashed dividers |
| `bp-amber` | `#C9901A` | Primary accent — Memphis warmth |
| `bp-steel` | `#6B9FC8` | Secondary — maker precision |
| `bp-text` | `#F2EDE6` | Body text (warm white) |
| Font display | Barlow Condensed 700 | All headings, nav, hero |
| Font mono | Space Mono 400 | Annotations, labels, dates |

## Key Patterns

**Bracket header:**
```astro
<BracketHeader title="Section Name" meta="KEY: VALUE" />
```

**Blueprint frame (corner ticks):**
```astro
<BlueprintFrame class="...">content</BlueprintFrame>
```

**Scroll reveal:**
```html
<div data-animate="from-left" data-animate-delay="200">...</div>
```
Values: `from-left`, `from-right`, `fade` (default is clip from bottom)
