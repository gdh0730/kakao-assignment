---
name: todo-next-fastapi
description: Use for this repository's Todo feature, API integration, verification, and documentation work. Follow the project harness and ADRs before editing code.
---

# Todo Next FastAPI Skill

## Workflow

1. Read `AGENTS.md`.
2. Check relevant docs in `docs/harness/`.
3. Check accepted ADRs in `docs/harness/decisions/`.
4. Make a small vertical slice.
5. Run relevant verification commands.
6. Update `docs/harness/prompt-log.md` for meaningful work.

## Boundaries

- Browser code calls Next `/api/*`.
- Next Route Handlers call FastAPI using `BACKEND_API_URL`.
- FastAPI owns Todo data and validation.
- Do not reintroduce `localStorage`.

## Verification

- Backend: `cd backend; pytest`
- Frontend: `cd frontend; npm run lint; npm run build`
- Source scan: `rg "localStorage|localhost:8000|127.0.0.1:8000" frontend/src backend/app`

