# ADR-0002: Frontend And Backend Boundary

## Status

Accepted

## Context

The assignment requires Next.js and FastAPI, and asks for clear frontend/backend separation.

## Decision

Use `frontend/` for Next.js and `backend/` for FastAPI.

## Why

Separate folders keep Node and Python dependencies, commands, and environment variables clear.

## Alternatives

- Place FastAPI inside the Next.js project.
- Use a single root package script to hide the separation.

## Consequences

Two dev servers are required, but the architecture is explicit and easier to explain.

## Validation

README includes separate setup and run commands for both services.

