# ADR-0001: Independent Project Boundary

## Status

Accepted

## Context

The previous assignment lives in a separate Vite React folder. This assignment must be GitHub-ready and independently reviewable.

## Decision

Create `todo-next-fastapi` as a separate Git repository root.

## Why

This prevents previous assignment artifacts, dependencies, and build outputs from mixing with the new submission.

## Alternatives

- Reuse the existing root and add `frontend/` and `backend/`.
- Move the old assignment into a `legacy/` folder.

## Consequences

The project is easier to submit and review, but useful prior code must be referenced manually.

## Validation

Before submission, confirm only `todo-next-fastapi` is under Git and old Vite files are absent.

