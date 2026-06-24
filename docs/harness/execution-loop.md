# Execution Loop

Use this loop for each meaningful Codex-assisted task.

1. Context: read relevant source, harness docs, and ADRs.
2. Plan: state the exact change and acceptance criteria.
3. Design: confirm API, data flow, component boundary, and failure modes.
4. Implement: make the smallest useful vertical slice.
5. Test: run focused tests first, then broader checks.
6. Verify: confirm behavior manually when UI or API behavior changed.
7. Review: inspect the diff for regressions and risky patterns.
8. Record: update prompt-log, ADR, README, or maintenance docs when needed.

## Done Means

- Code compiles.
- Tests relevant to the touched area pass.
- The docs still match the implementation.
- Any architectural decision is recorded.

