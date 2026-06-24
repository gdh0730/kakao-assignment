# Prompt Log

## 2026-06-24

### Initial Implementation

- Request: implement an independent GitHub-ready Next.js + FastAPI Todo app with Agentic AI harness.
- Decisions applied: independent repository, BFF Route Handler, FastAPI source of truth, repo-scoped Codex skill, optional hooks.
- Verification target: backend pytest, frontend lint/build, repository scan.

### Implementation Result

- Built FastAPI Todo API with SQLite, SQLAlchemy, Pydantic schemas, filters, sorting, pagination, and week counts.
- Built Next.js App Router frontend with Server Component entry, Client Component Todo UI, and `route.ts` BFF proxy.
- Added `AGENTS.md`, repo skill, harness docs, ADRs, optional Codex MCP/hook examples, and README.
- Verification passed: `pytest`, `npm run lint`, `npm run build`, forbidden source scan, BFF CRUD smoke test, `localhost:8000/docs`, and `localhost:3000`.

### Server-Based Search

- Request: add `GET /todos?search=keyword` and `GET /todos?filter=active&search=keyword`.
- Decision: keep search server-owned by applying it inside the FastAPI SQLAlchemy query with existing view/filter/sort/page conditions.
- Frontend: added a search form that submits keywords through the existing Next `/api/todos` BFF route.
- Verification target: backend search tests, frontend lint/build, BFF search smoke test.
