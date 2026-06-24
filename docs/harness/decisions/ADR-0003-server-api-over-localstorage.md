# ADR-0003: Server API Over localStorage

## Status

Accepted

## Context

The previous Todo app stored data in browser `localStorage`. This assignment requires moving data flow to a server API.

## Decision

FastAPI and SQLite own Todo data. Frontend state is limited to UI concerns.

## Why

This demonstrates API contracts, backend validation, database persistence, and the difference between browser-only state and server-owned data.

## Alternatives

- Keep `localStorage` and sync later.
- Fetch all Todos and filter in the client.

## Consequences

The backend has more responsibility, but persistence and validation are centralized.

## Validation

Repository scan must not find `localStorage` in source code.

