# ADR-0004: Next Route Handler As BFF

## Status

Accepted

## Context

The browser needs Todo data, but the backend API URL should be environment-specific and not hardcoded into client code.

## Decision

Use Next.js `route.ts` handlers as a Backend-for-Frontend proxy to FastAPI.

## Why

This keeps `BACKEND_API_URL` server-only and lets the browser call stable relative `/api/*` paths.

## Alternatives

- Browser calls FastAPI directly.
- Use Next rewrites only.

## Consequences

There is one extra hop, but it makes the App Router API Route requirement explicit.

## Validation

Frontend source must not hardcode FastAPI URLs, and browser code should call `/api/todos`.

