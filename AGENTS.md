# AGENTS.md

## Repository Purpose

This repository is an independent third assignment project. Do not copy the prior Vite/localStorage assignment into this repository; use it only as a reference for behavior.

## Working Loop

- Before implementation, read the relevant files in `docs/harness/` and any accepted ADR under `docs/harness/decisions/`.
- Work in small vertical slices: backend API, Next route handler, UI, then verification.
- Keep `frontend/` and `backend/` boundaries explicit. Browsers call Next `/api/*`; Next route handlers call FastAPI.
- Update `docs/harness/prompt-log.md` for meaningful Codex-assisted work.
- Add an ADR only for decisions that affect architecture, API boundaries, data ownership, or the development process.

## Verification

- Backend changes require `cd backend; pytest`.
- Frontend changes require `cd frontend; npm run lint; npm run build`.
- Before final submission, run `rg "localStorage|localhost:8000|127.0.0.1:8000" frontend/src backend/app`.
- Do not commit `node_modules`, `.next`, `.venv`, `.env.local`, or SQLite database files.

## Engineering Rules

- Use TypeScript types for frontend API contracts.
- Keep interactive Todo UI in Client Components marked with `"use client"`.
- Keep `layout.tsx` and `page.tsx` as Server Components unless a documented ADR changes that.
- Use FastAPI and SQLAlchemy as the source of truth for Todo data.
- Do not expose `BACKEND_API_URL` to the browser with `NEXT_PUBLIC_`.

