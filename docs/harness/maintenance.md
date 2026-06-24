# Maintenance

## Dependency Updates

- Prefer normal semver-compatible updates first.
- Do not run force upgrades without reading the changelog and checking build/test results.
- Record risky updates in `prompt-log.md`.

## Feature Changes

- Update API types before changing UI integration.
- Add backend tests for new API behavior.
- Update README when setup or commands change.

## Bug Fixes

- Follow `problem-solving-loop.md`.
- Add a regression test when the bug is deterministic.
- Update `risk-register.md` if the issue exposes a recurring risk.

