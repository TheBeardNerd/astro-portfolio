# Tailwind Migration Decision (Phase 3)

## Decision

Keep the project on **Tailwind 3 + `@astrojs/tailwind`** for now.

## Rationale

- Current build is stable and clean.
- The project is small and largely static; immediate migration benefit is limited.
- Phase 1/2 refactors just landed, so minimizing concurrent platform churn reduces risk.

## Trigger Conditions for Migration

Proceed with Tailwind 4 migration when one or more of these become true:

1. A dependency or security policy requires Tailwind 4.
2. A needed plugin/feature is only available or better-supported on Tailwind 4.
3. Scheduled modernization window exists for non-feature technical work.

## Planned Migration Window

- Target: next maintenance cycle after current refactor stabilization.
- Preconditions:
  - CI remains green for at least one full release cycle.
  - No active UI redesign branch competing with migration.

## Execution Plan (High Level)

1. Create migration branch and snapshot baseline Lighthouse/build metrics.
2. Add Tailwind 4 support via Astro/Vite plugin flow.
3. Remove `@astrojs/tailwind` integration and legacy config usage.
4. Update global styles/import strategy to Tailwind 4 conventions.
5. Run full visual QA for navigation, resume, and contact sections.
6. Compare baseline metrics and ship only if parity/regression thresholds are met.

## Rollback Criteria

Rollback migration branch if any of the following occur and cannot be fixed quickly:

- Build instability in CI.
- Significant style regressions on core pages.
- New bundle/performance regressions beyond accepted threshold.
