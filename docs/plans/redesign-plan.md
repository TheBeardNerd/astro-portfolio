# Portfolio Redesign: Compelling Personal Website

## Context

Travis's portfolio currently presents him as "web developer, designer, podcaster, and woodworker" — a description that predates his current role as Software Engineer at the Memphis Grizzlies. The site has a clean but generic structure: hero → skills → contact form. The goal is a full redesign that centers his actual story — a winding path from manual labor to his dream role with his hometown NBA team — using a visual career timeline as the narrative backbone.

**Design decisions:**

- Story format: visual timeline
- Hero: Lead with personality ("Hello, I'm Travis") with a stronger, more confident tagline
- Identity: Software Engineer, Maker (3D printing, Raspberry Pi, NAS/Plex) — no longer a podcaster

---

## Approach

Keep the existing stack (Astro + Tailwind), routing, and design system (teal palette, existing fonts). Restructure the homepage into four story-driven sections, add a new CareerTimeline component, and update the Skills section to reflect his actual identity.

---

## Changes

### 1. `src/config/site.ts`

- Update `DEFAULT_PAGE_TITLE` → `"Software Engineer | Memphis Grizzlies"`
- Update `DEFAULT_PAGE_DESCRIPTION` → `"Hello, I'm Travis — Software Engineer at the Memphis Grizzlies, Memphis-born maker, and lifelong problem-solver."`

### 2. `src/pages/index.astro` — Full hero restructure + new Story section

**Hero section** (replace existing):

- Keep headshot
- H1: `"Hello. I'm Travis."` (keep the personality)
- Tagline: `"Software Engineer at the Memphis Grizzlies. Memphis-born problem-solver, maker, and lifelong learner."` with the role colored in teal
- Remove the multi-colored role list (web developer/designer/podcaster/woodworker)
- Two CTAs: "My Story" (smooth scroll to `#story`) and "See My Resumé" (link to `/resume`)

**Story section** (new — insert between hero and skills, `id="story"`):

- Section heading: `"The Long Way Around"`
- Brief 2-sentence intro paragraph
- `<CareerTimeline />` component

**Skills section** — import updated `<Skills />` (no structural change; content handled in Skills.astro)

**Contact section** — no changes

### 3. `src/components/CareerTimeline.astro` (NEW)

Visual vertical timeline with 7 milestones. Each milestone: date range, title, 1–2 sentence description.

**Milestones:**
| # | Title | Dates | Description |
|---|-------|-------|-------------|
| 1 | Memphis Roots | — | Born and raised in Memphis, TN. This city shaped everything. |
| 2 | Building Work Ethic | pre-2010 | Restaurant kitchens, Lowe's assembly — learning to show up and grind. |
| 3 | First Tech-Adjacent Role | Dec 2010–Feb 2013 | AT&T Uverse Wire Technician, installing internet and cable. First hint that technology was interesting. |
| 4 | Five Years on the Freight Yard | July 2014–July 2019 | Hostler at Estes Express Lines. Stable, but restless. Started community college classes looking for more. |
| 5 | The Spark | Sept 2018 | Oldest brother invited him into Tech901's Code 1.0 bootcamp. Discovered he loved solving problems through code. |
| 6 | First Dev Role | July 2019 | Front End Developer at Elite Deals. A LinkedIn connection-of-a-connection opened the door. |
| 7 | The Grizzlies Call | Present | A Tech901 instructor he'd never met reached out on LinkedIn. Software Engineer at the Memphis Grizzlies — his hometown team. Couldn't say no. |

**Layout:**

- Vertical teal line down the center (desktop) / left edge (mobile)
- Alternating left/right cards on `md:` and above; single column on mobile
- Each card: teal dot on the line, year badge, bold title, description
- Uses existing Tailwind classes and teal palette; no new dependencies

### 4. `src/components/Skills.astro` — Content update only

| Old                     | New                                                                          |
| ----------------------- | ---------------------------------------------------------------------------- |
| Designing               | Designing (update description to reflect web/UI work at the Grizzlies)       |
| Coding                  | Coding (update: Software Engineering, front-end, Salesforce Marketing Cloud) |
| Podcasting → **Making** | 3D printing, Raspberry Pi, NAS/Plex building, tinkering                      |
| Creating                | Creating (keep — building things, solving problems, shipping)                |

### 5. `src/components/Icon.astro` — Add maker icon

Add a `maker` icon case (wrench/tools SVG) to replace the `podcast` icon used in the Skills section.

---

## Files NOT changing

- `src/layouts/Layout.astro`
- `src/components/Navigation.astro`
- `src/components/ContactForm.astro`
- `src/pages/resume.astro`
- `src/data/resume.ts`
- `src/styles/global.css`
- `tailwind.config.mjs`
- All resume components

---

## Verification

```bash
npm run dev          # Visual check: hero, story section, timeline, skills
npm run build        # Type-check + production build must pass
npm run lint         # No new lint errors
npm run lint:a11y    # Timeline and new copy must pass accessibility checks
```

Manual checks:

- Timeline renders correctly on mobile (single column) and desktop (alternating)
- CTA links work (smooth scroll to `#story`, link to `/resume`)
- Skills section shows 4 updated items with correct icons
- Site title/description updated in browser tab and OG tags
