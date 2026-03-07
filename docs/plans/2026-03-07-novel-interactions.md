# Novel Interactions Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add four interactive/generative enhancements to the Blueprint portfolio — SVG schematic watermarks, ECG timeline pulse, live telemetry panel, and a canvas drafting-hand effect on the hero.

**Architecture:** Four independent tasks, each self-contained. No new pages. No new dependencies. Two new Astro components (`TelemetryPanel.astro`, `HeroDraftingCanvas.astro`). All JS is inline `<script>` per component (Astro pattern). Tasks are ordered lowest-to-highest risk.

**Tech Stack:** Astro 5, Tailwind CSS v4, vanilla JS, Canvas API. Design reference: `docs/plans/2026-03-07-novel-interactions-design.md`.

**Verification after every task:** `npm run build` must pass. Run `npm run lint:a11y` after any task touching interactive elements.

---

## Task 1: SVG Schematic Watermarks (Skills Cards)

Replace the `01`–`04` number watermarks in each skill card with unique inline SVG circuit schematic symbols.

**Files:**
- Modify: `src/components/Skills.astro`

### Step 1: Add the SVG definitions array

In `src/components/Skills.astro`, after the `offsets` constant (line 37), add this array of SVG symbol markup strings:

```astro
// SVG schematic symbols — one per card, in order
const schematics = [
  // 01 — Resistor (zigzag)
  `<svg viewBox="0 0 90 30" width="90" height="30" fill="none" stroke="#C9901A" stroke-width="1.5" stroke-linejoin="round" aria-hidden="true">
    <line x1="0" y1="15" x2="13" y2="15"/>
    <polyline points="13,15 18,5 26,25 34,5 42,25 50,5 58,25 66,5 71,15 77,15"/>
    <line x1="77" y1="15" x2="90" y2="15"/>
  </svg>`,
  // 02 — Capacitor (two parallel plates)
  `<svg viewBox="0 0 90 30" width="90" height="30" fill="none" stroke="#C9901A" stroke-width="1.5" aria-hidden="true">
    <line x1="0" y1="15" x2="40" y2="15"/>
    <line x1="40" y1="4" x2="40" y2="26"/>
    <line x1="45" y1="4" x2="45" y2="26"/>
    <line x1="45" y1="15" x2="90" y2="15"/>
  </svg>`,
  // 03 — AND gate (D-shape)
  `<svg viewBox="0 0 90 30" width="90" height="30" fill="none" stroke="#C9901A" stroke-width="1.5" aria-hidden="true">
    <path d="M 20 4 L 48 4 A 11 11 0 0 1 48 26 L 20 26 Z"/>
    <line x1="0" y1="10" x2="20" y2="10"/>
    <line x1="0" y1="20" x2="20" y2="20"/>
    <line x1="59" y1="15" x2="90" y2="15"/>
  </svg>`,
  // 04 — Ground (three descending bars)
  `<svg viewBox="0 0 90 30" width="90" height="30" fill="none" stroke="#C9901A" stroke-width="1.5" stroke-linecap="round" aria-hidden="true">
    <line x1="45" y1="0" x2="45" y2="8"/>
    <line x1="16" y1="8" x2="74" y2="8"/>
    <line x1="26" y1="16" x2="64" y2="16"/>
    <line x1="36" y1="24" x2="54" y2="24"/>
  </svg>`,
] as const
```

### Step 2: Replace the number watermark div

Find the `<div>` that renders `{skill.num}` (currently lines 67–73 in `Skills.astro`):

```astro
<div
  class="absolute top-4 right-6 font-mono text-7xl font-bold text-bp-amber select-none pointer-events-none transition-opacity duration-150 group-hover:opacity-[0.18]"
  style="opacity: 0.08;"
  aria-hidden="true"
>
  {skill.num}
</div>
```

Replace it with:

```astro
<div
  class="absolute bottom-4 right-6 select-none pointer-events-none transition-opacity duration-150 group-hover:opacity-[0.32]"
  style="opacity: 0.18;"
  set:html={schematics[index]}
/>
```

### Step 3: Verify

```bash
npm run build
```

Expected: build passes, no type errors. Visually confirm each card shows its schematic symbol in the lower-right corner at low opacity.

### Step 4: Commit

```bash
git add src/components/Skills.astro
git commit -m "feat: replace skill card number watermarks with SVG schematic symbols"
```

---

## Task 2: ECG Timeline Pulse (Build Log)

Replace the straight amber margin line in the Build Log with an SVG sine-wave path that draws on scroll.

**Files:**
- Modify: `src/components/CareerTimeline.astro`
- Modify: `src/styles/global.css`
- Modify: `src/layouts/Layout.astro`

### Step 1: Replace the margin line div with an SVG

In `src/components/CareerTimeline.astro`, find the margin line div (lines 80–84):

```astro
<div
  class="build-log-line absolute top-0 left-0 w-px bg-bp-amber md:left-[18%]"
  aria-hidden="true"
>
</div>
```

Replace it with:

```astro
<svg
  class="ecg-line-svg absolute top-0 left-0 md:left-[18%]"
  width="6"
  height="100%"
  style="overflow: visible;"
  aria-hidden="true"
>
  <path
    class="ecg-line-path"
    fill="none"
    stroke="#C9901A"
    stroke-width="1"
    d=""
  />
</svg>
```

### Step 2: Add the path-generation script

At the bottom of `CareerTimeline.astro`, before the closing `</div>`, add:

```astro
<script>
  const svg = document.querySelector<SVGSVGElement>('.ecg-line-svg')
  const path = document.querySelector<SVGPathElement>('.ecg-line-path')
  const container = svg?.parentElement

  if (svg && path && container) {
    const AMPLITUDE = 2
    const WAVELENGTH = 40

    function buildPath(h: number): string {
      let d = `M ${AMPLITUDE} 0`
      for (let y = 1; y <= h; y += 3) {
        const x = AMPLITUDE + AMPLITUDE * Math.sin((y / WAVELENGTH) * 2 * Math.PI)
        d += ` L ${x} ${y}`
      }
      return d
    }

    function init() {
      const h = container.offsetHeight
      svg.setAttribute('height', String(h))
      path.setAttribute('d', buildPath(h))

      const length = path.getTotalLength()
      path.style.strokeDasharray = String(length)
      path.style.strokeDashoffset = String(length)

      // Observe and animate
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              path.style.strokeDashoffset = '0'
              observer.unobserve(entry.target)
            }
          })
        },
        { threshold: 0.05 },
      )
      observer.observe(svg)
    }

    // Run after paint so container has correct height
    requestAnimationFrame(init)
  }
</script>
```

### Step 3: Add CSS for the path transition

In `src/styles/global.css`, add after the `.build-log-line` block:

```css
/* ── ECG timeline pulse ───────────────────────────────── */
.ecg-line-path {
  transition: stroke-dashoffset 1.5s ease-out;
}

@media (prefers-reduced-motion: reduce) {
  .ecg-line-path {
    transition: none;
    stroke-dashoffset: 0 !important;
  }
}
```

### Step 4: Remove build-log-line from Layout.astro observer

In `src/layouts/Layout.astro`, find the line (line 81):

```js
document
  .querySelectorAll('.bracket-line, .build-log-line')
  .forEach((el) => lineObserver.observe(el))
```

Change it to:

```js
document
  .querySelectorAll('.bracket-line')
  .forEach((el) => lineObserver.observe(el))
```

The `.build-log-line` CSS class and its height animation in `global.css` can remain — they are now unused dead CSS and won't cause any harm. Removing them is optional cleanup.

### Step 5: Verify

```bash
npm run build
```

Expected: build passes. Scroll into the Build Log section — the amber line should draw downward as a gentle sine wave rather than a straight line.

### Step 6: Commit

```bash
git add src/components/CareerTimeline.astro src/styles/global.css src/layouts/Layout.astro
git commit -m "feat: replace build log straight line with ECG sine-wave path animation"
```

---

## Task 3: Live Telemetry Panel

A fixed data-block panel (desktop only, lower-left) showing Memphis time, session uptime, and scroll percentage.

**Files:**
- Create: `src/components/TelemetryPanel.astro`
- Modify: `src/layouts/Layout.astro`

### Step 1: Create TelemetryPanel.astro

Create `src/components/TelemetryPanel.astro` with the following content:

```astro
---
import CornerTicks from './blueprint/CornerTicks.astro'
---

<aside
  id="telemetry-panel"
  aria-hidden="true"
  class="hidden lg:block fixed bottom-6 left-6 z-40"
  style="opacity: 0; transition: opacity 400ms ease-out;"
>
  <div class="relative border border-bp-border p-3 w-44" style="background: #111518;">
    <CornerTicks />
    <div class="font-mono text-[10px] text-bp-steel tracking-widest mb-2">
      // TELEMETRY ————
    </div>
    <div class="space-y-1">
      <div class="flex justify-between font-mono text-[11px]">
        <span class="text-bp-steel">LOC</span>
        <span class="text-bp-text">MEMPHIS, TN</span>
      </div>
      <div class="flex justify-between font-mono text-[11px]">
        <span class="text-bp-steel">TIME</span>
        <span id="tel-time" class="text-bp-text tabular-nums">--:--:--</span>
      </div>
      <div class="flex justify-between font-mono text-[11px]">
        <span class="text-bp-steel">SESSION</span>
        <span id="tel-session" class="text-bp-text tabular-nums">00:00:00</span>
      </div>
      <div class="flex justify-between font-mono text-[11px]">
        <span class="text-bp-steel">SCROLL</span>
        <span id="tel-scroll" class="text-bp-text tabular-nums">0%</span>
      </div>
    </div>
  </div>
</aside>

<script>
  const panel = document.getElementById('telemetry-panel') as HTMLElement | null
  const timeEl = document.getElementById('tel-time')
  const sessionEl = document.getElementById('tel-session')
  const scrollEl = document.getElementById('tel-scroll')

  if (
    panel &&
    timeEl &&
    sessionEl &&
    scrollEl &&
    window.matchMedia('(min-width: 1024px)').matches
  ) {
    const sessionStart = Date.now()

    function pad(n: number): string {
      return String(n).padStart(2, '0')
    }

    function updateTime(): void {
      const now = new Date()

      // Memphis time (Central Time)
      const formatted = new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/Chicago',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }).format(now)
      timeEl.textContent = formatted

      // Session uptime
      const elapsed = Math.floor((Date.now() - sessionStart) / 1000)
      const h = Math.floor(elapsed / 3600)
      const m = Math.floor((elapsed % 3600) / 60)
      const s = elapsed % 60
      sessionEl.textContent = `${pad(h)}:${pad(m)}:${pad(s)}`
    }

    function updateScroll(): void {
      const max = document.documentElement.scrollHeight - window.innerHeight
      const pct = max > 0 ? Math.round((window.scrollY / max) * 100) : 0
      scrollEl.textContent = `${pct}%`
    }

    // Fade in after hero sequence completes
    setTimeout(() => {
      panel.style.opacity = '1'
    }, 1500)

    setInterval(updateTime, 1000)
    updateTime()

    window.addEventListener('scroll', updateScroll, { passive: true })
    updateScroll()
  }
</script>
```

### Step 2: Add TelemetryPanel to Layout.astro

In `src/layouts/Layout.astro`:

Add the import at the top of the frontmatter block (after the existing imports):
```astro
import TelemetryPanel from '../components/TelemetryPanel.astro'
```

Add the component just before the closing `</body>` tag (after the `<script>` block):
```astro
    <TelemetryPanel />
  </body>
```

### Step 3: Verify

```bash
npm run build
npm run lint:a11y
```

Expected: build passes, no a11y errors (panel is `aria-hidden`). On a desktop browser, wait 1.5 seconds after load — the panel should fade in at the lower-left, time should update every second, scroll percentage should update on scroll.

### Step 4: Commit

```bash
git add src/components/TelemetryPanel.astro src/layouts/Layout.astro
git commit -m "feat: add live telemetry panel (Memphis time, session, scroll)"
```

---

## Task 4: Canvas Drafting Hand (Hero)

A canvas overlay on the hero that renders cursor trace paths and a grid cell glow field — making the hero feel like a live working document.

**Files:**
- Create: `src/components/HeroDraftingCanvas.astro`
- Modify: `src/pages/index.astro`

### Step 1: Create HeroDraftingCanvas.astro

Create `src/components/HeroDraftingCanvas.astro`:

```astro
---
// No props — fully self-contained
---

<canvas
  id="hero-canvas"
  aria-hidden="true"
  class="absolute inset-0 w-full h-full pointer-events-none"
  style="z-index: 0; display: block;"
></canvas>

<script>
  const canvas = document.getElementById('hero-canvas') as HTMLCanvasElement | null
  if (!canvas) throw new Error('hero-canvas not found')

  // Respect reduced-motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    canvas.style.display = 'none'
  } else {
    const ctx = canvas.getContext('2d')!
    const GRID = 40
    const TRACE_LIFE = 1800 // ms before a trace point fades out
    const GLOW_RADIUS = 100
    const isPointer = window.matchMedia('(pointer: fine)').matches

    interface TracePoint {
      x: number
      y: number
      time: number
    }

    let mouseX = -9999
    let mouseY = -9999
    let traces: TracePoint[] = []
    let rafId = 0

    // Mobile Lissajous state
    let lisx = 0
    let lisy = 0

    function resize(): void {
      const dpr = window.devicePixelRatio || 1
      const W = canvas.offsetWidth
      const H = canvas.offsetHeight
      canvas.width = W * dpr
      canvas.height = H * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    function drawFrame(): void {
      const W = canvas.offsetWidth
      const H = canvas.offsetHeight
      const now = performance.now()

      ctx.clearRect(0, 0, W, H)

      // ── Mobile: advance Lissajous point ──
      if (!isPointer) {
        const t = now / 20000
        lisx = W * 0.5 + W * 0.3 * Math.sin(2 * t * Math.PI)
        lisy = H * 0.5 + H * 0.3 * Math.sin(3 * t * Math.PI + 0.785)
        traces.push({ x: lisx, y: lisy, time: now })
      }

      // ── Grid cell glow ──
      const cx = isPointer ? mouseX : lisx
      const cy = isPointer ? mouseY : lisy
      const mobileAlphaScale = isPointer ? 1 : 0.5

      if (cx > -9000) {
        const startCol = Math.floor((cx - GLOW_RADIUS) / GRID)
        const endCol = Math.ceil((cx + GLOW_RADIUS) / GRID)
        const startRow = Math.floor((cy - GLOW_RADIUS) / GRID)
        const endRow = Math.ceil((cy + GLOW_RADIUS) / GRID)

        for (let row = startRow; row <= endRow; row++) {
          for (let col = startCol; col <= endCol; col++) {
            const cellX = col * GRID
            const cellY = row * GRID
            const centerX = cellX + GRID / 2
            const centerY = cellY + GRID / 2
            const dist = Math.hypot(centerX - cx, centerY - cy)

            if (dist < GLOW_RADIUS) {
              const alpha = (1 - dist / GLOW_RADIUS) * 0.06 * mobileAlphaScale
              ctx.fillStyle = `rgba(201,144,26,${alpha})`
              ctx.fillRect(cellX, cellY, GRID, GRID)
            }
          }
        }
      }

      // ── Trace paths ──
      // Cull expired points
      traces = traces.filter((p) => now - p.time < TRACE_LIFE)

      if (traces.length > 1) {
        const maxAlpha = isPointer ? 0.55 : 0.22
        for (let i = 1; i < traces.length; i++) {
          const prev = traces[i - 1]
          const curr = traces[i]
          const age = now - curr.time
          const alpha = Math.max(0, 1 - age / TRACE_LIFE) * maxAlpha

          ctx.beginPath()
          ctx.moveTo(prev.x, prev.y)
          ctx.lineTo(curr.x, curr.y)
          ctx.strokeStyle = `rgba(201,144,26,${alpha.toFixed(3)})`
          ctx.lineWidth = 1
          ctx.lineCap = 'round'
          ctx.stroke()
        }
      }

      rafId = requestAnimationFrame(drawFrame)
    }

    // ── Resize handling ──
    const ro = new ResizeObserver(resize)
    ro.observe(canvas.parentElement!)
    resize()

    // ── Mouse events (desktop only) ──
    if (isPointer) {
      const hero = canvas.closest('section')!

      hero.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect()
        mouseX = e.clientX - rect.left
        mouseY = e.clientY - rect.top
        traces.push({ x: mouseX, y: mouseY, time: performance.now() })
      })

      hero.addEventListener('mouseleave', () => {
        // Don't reset mouseX/Y — let existing traces fade naturally
        // New glow stops because mouse is out of hero bounds
        mouseX = -9999
        mouseY = -9999
      })
    }

    // ── Start loop ──
    rafId = requestAnimationFrame(drawFrame)

    // ── Cleanup on navigation (Astro view transitions) ──
    document.addEventListener('astro:before-swap', () => {
      cancelAnimationFrame(rafId)
      ro.disconnect()
    })
  }
</script>
```

### Step 2: Add HeroDraftingCanvas to the hero section

In `src/pages/index.astro`, add the import in the frontmatter:

```astro
import HeroDraftingCanvas from '../components/HeroDraftingCanvas.astro'
```

Then add the component as the first child inside the hero `<section>` tag (line 11), before the content wrapper div. The section already has `class="relative ..."` which is needed for the `absolute inset-0` canvas to position correctly:

```astro
<section
  class="relative flex flex-col min-h-svh px-6 md:px-12 pb-20 overflow-hidden"
  aria-label="Introduction"
>
  <HeroDraftingCanvas />
  <!-- Vertically centered content wrapper -->
  <div class="relative z-10 w-full max-w-screen-xl mx-auto flex flex-col flex-1 justify-center gap-4 md:gap-5 py-8">
```

Note: the content wrapper div needs `relative z-10` added so it sits above the canvas (z-index 0). Check whether the div already has these classes — if not, add them.

### Step 3: Verify

```bash
npm run build
npm run lint:a11y
```

Expected: build passes, no a11y errors (canvas is `aria-hidden`). In a browser on desktop, move the mouse over the hero — amber trace lines should follow the cursor and fade over ~1.8 seconds. Grid cells near the cursor should glow faintly amber. On mobile, a faint autonomous trace should drift slowly across the hero.

Test `prefers-reduced-motion: reduce` in browser devtools — canvas should be hidden entirely.

### Step 4: Commit

```bash
git add src/components/HeroDraftingCanvas.astro src/pages/index.astro
git commit -m "feat: add canvas drafting-hand effect to hero (trace paths + grid glow)"
```

---

## Final verification

Run the full CI gate:

```bash
npm run ci
```

Expected: all checks pass — format, lint, a11y strict, build.
