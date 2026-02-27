# Tailwind 4 Migration Runbook (Astro Portfolio)

## Status

Migration executed on 2026-02-26 and validated locally.

This document is the execution-ready runbook to migrate from:

- Astro Tailwind 3 integration: @astrojs/tailwind
- Tailwind package: tailwindcss v3

to:

- Vite plugin integration: @tailwindcss/vite
- Tailwind package: tailwindcss v4

## Why and When

Migrate when at least one condition is true:

1. Policy or security requirements mandate v4.
2. A needed feature is only available in v4.
3. A scheduled technical modernization window is available.

Do not combine this migration with visual redesign work.

## Preconditions (Go/No-Go)

All items must be true before execution:

- CI is green on main for at least one release cycle.
- No concurrent branch changing major layout or typography structure.
- Node runtime is v20+ (Tailwind upgrade tooling and ecosystem expectation).
- Browser support target allows modern baseline:
  - Chrome 111+
  - Safari 16.4+
  - Firefox 128+

## Migration Checklist

- [ ] Create migration branch and capture baseline metrics
- [x] Replace Astro Tailwind v3 integration with Vite Tailwind v4 plugin
- [x] Move global Tailwind entry CSS to v4 syntax
- [x] Audit utility/class compatibility changes from v3 to v4
- [x] Run formatting, lint, strict a11y lint, Astro check, and build
- [x] Perform visual QA on home, resume, and contact flows
- [x] Compare baseline metrics and decide ship/rollback

### Execution Notes (2026-02-26)

- Dependencies migrated to Tailwind 4 and Vite plugin.
- Compatibility updates applied:
  - bg-opacity-75 to bg-black/75
  - outline-none to outline-hidden
- Post-migration nav animation fix for Tailwind v4 translate behavior:
  - removed conflicting `-translate-x-full` utility on animated links
  - switched custom animation to `translate` property
- Build artifact snapshot after migration:
  - dist/\_astro/index.DKuIdfZ3.css at ~21 KB
- Visual smoke check passed: nav open/close, overlay opacity, and slide animation.
- Decision: ship.

## Step-by-Step Execution

### 1) Create branch and baseline

Run:

```bash
git checkout -b chore/tailwind-v4-migration
npm ci
npm run ci
```

Capture and save:

- Lighthouse snapshot for / and /resume
- Build duration from npm run build
- Generated CSS bundle size from dist assets

### 2) Install Tailwind v4 integration

Preferred controlled path (manual) for this repo:

```bash
npm uninstall @astrojs/tailwind
npm install tailwindcss @tailwindcss/vite
```

Update Astro config:

- Remove @astrojs/tailwind import and integrations entry.
- Add @tailwindcss/vite plugin under vite.plugins.

Reference: Astro styling docs and Tailwind Astro framework guide.

### 3) Update Tailwind entry CSS

In global stylesheet, replace Tailwind v3 directives:

- remove @tailwind base;
- remove @tailwind components;
- remove @tailwind utilities;

with v4 import:

- @import "tailwindcss";

### 4) Handle config and custom styles

Tailwind v4 does not auto-detect JS config by default.

- If no custom tokens/plugins are needed, remove legacy Tailwind config file.
- If custom config is required, explicitly load it from CSS using @config.

If custom utility definitions are migrated, prefer v4 patterns and verify generated output.

### 5) v3 to v4 compatibility audit

Run targeted scans for known changes and update as needed:

- outline-none to outline-hidden
- ring to ring-3 where 3px intent exists
- implicit ring color assumptions
- implicit border color assumptions
- removed opacity utilities (bg-opacity-_, text-opacity-_, etc.)
- transform transition lists using transform keyword

Also verify space/divide behavior in places using child combinator spacing utilities.

### 6) Validate quality gates

Run:

```bash
npm run format:check
npm run lint
npm run lint:a11y:strict
npm run build
```

All commands must pass before visual QA starts.

### 7) Visual QA scope

Check at minimum:

- Navigation open/close animation and responsive menu layout.
- Resume page typography hierarchy, spacing, dividers, and logos.
- Contact form inputs, focus styles, hover/focus states, and button appearance.
- Footer spacing/alignment and social icon hover states.

### 8) Decision gate

Ship only if all are true:

- CI fully green
- No high-severity visual regressions
- Performance parity within acceptable thresholds vs baseline

## Rollback Plan

Rollback if there is build instability, inaccessible UI regressions, or unacceptable visual drift.

Fast rollback path:

```bash
git restore astro.config.mjs src/styles/global.css package.json package-lock.json
npm ci
npm run ci
```

If rollback is required after merge, revert migration commit as a single unit.

## Risks and Mitigations

1. Utility behavior differences cause subtle UI drift.

- Mitigation: targeted compatibility audit + visual QA checklist.

2. Browser support mismatch for v4 features.

- Mitigation: enforce modern browser support policy before migration.

3. Tailwind config assumptions break in v4.

- Mitigation: remove unused config or explicitly wire config with @config.

## Acceptance Criteria

Migration is complete when all criteria are met:

- Tailwind v4 and @tailwindcss/vite are active.
- @astrojs/tailwind is removed from dependencies and Astro config.
- Global CSS uses @import "tailwindcss".
- Quality gates pass locally and in CI.
- Manual QA confirms no high-severity UI or accessibility regressions.
