# Hero Section Redesign — Design Document
**Date:** 2026-03-04
**Status:** APPROVED
**Scope:** Three focused changes to the existing blueprint hero — value hook, CTA structure, name display

---

## Context

Applied hero section best practices (Muzli / Outcrowd) to the existing blueprint design:
- Lead with **value/benefits**, not just identity
- Every element earns its space
- One primary CTA + one subtle secondary
- Idea first, then button

---

## Change 1 — Name Wordmark

**Before:** `TRAVIS` at `18vw`, single line.

**After:** Two-line nameplate using intentional size contrast.

```
TRAVIS           ← font-size: 18vw (unchanged)
WINDSOR-CUMMINGS ← font-size: ~7vw (sized to approximate TRAVIS rendered width)
```

Both lines: Barlow Condensed 700, `line-height: 0.88`, left-aligned. The size difference is intentional — first name dominates as identity, surname grounds it as full signature. Reads as a single unit due to tight line-height.

---

## Change 2 — Tagline (new element)

**Placement:** Injected between the subtitle mono line and the two-column data block.

**Copy:** `FIELD TESTED. BUILT DIFFERENTLY.`

**Treatment:**
- Font: Barlow Condensed 700 (display)
- Size: `~1.5rem` to `2rem`
- Color: `text-bp-text` (`#F2EDE6`) — neutral warm white, does not compete with amber CTA
- No border or annotation wrapper — the idea stands alone
- Animation: `data-animate="fade"` at `data-animate-delay="800"`

**Purpose:** Answers "why should I care?" before the visitor reaches the CTA. Bridges hiring managers (grit + credibility) and peers (non-traditional path) without explaining either. "FIELD TESTED" is blueprint annotation language. "BUILT DIFFERENTLY" has double meaning — physical labor background + software craft.

---

## Change 3 — Revision Block → Secondary CTA

**Before:** Blueprint revision block (`DRAWN BY / DATE / REV`) occupied the lower-left column below the primary CTA. Blueprint flavor, zero visitor value.

**After:** Removed. Replaced with a secondary text link.

```
[VIEW RECORD →]    ← primary button (amber-filled, unchanged)
CONTACT →          ← secondary text link
```

**Treatment for secondary CTA:**
- Font: Space Mono, `text-xs`, `tracking-widest`
- Color: `text-bp-amber`
- No button chrome — bare text link
- `href="/contact"` or `#contact` anchor to ContactForm section
- Animation: `data-animate="fade"` at `data-animate-delay="1200"`

---

## Updated Animation Sequence

| Delay | Element | Note |
|---|---|---|
| 200ms | "TRAVIS WINDSOR-CUMMINGS" wordmark | unchanged |
| 500ms | Subtitle mono | unchanged |
| 700ms | Datum line | unchanged |
| **800ms** | **Tagline** | **new** |
| 1000ms | Primary CTA (`VIEW RECORD →`) | unchanged |
| 1100ms | Headshot + coordinates | unchanged |
| 1200ms | Secondary CTA (`CONTACT →`) | replaces revision block |
| 1400ms | Scroll prompt | unchanged |

---

## What Does Not Change

- Blueprint grid background, color palette, all CSS custom properties
- Datum line `[ v2.0 ]` between wordmark and subtitle
- Right column: coordinates, headshot in corner-tick frame, SUBJECT label
- Scroll prompt: `↓ scroll to begin`
- All other sections (Story, Skills, Contact, Footer)
