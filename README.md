# Next.js + FastAPI Daily Todo

독립 GitHub 제출용 Todo 앱입니다. 기존 Vite/localStorage 과제는 참고만 했고, 이 저장소는 Next.js App Router와 FastAPI 기반으로 새로 구성했습니다.

## Stack

- Frontend: Next.js App Router, React, TypeScript, Tailwind CSS v4, Axios
- Backend: FastAPI, Uvicorn, SQLAlchemy 2.0, SQLite, Pydantic v2
- Agentic AI: `AGENTS.md`, repo-scoped skill, `docs/harness/`, ADR, verification gates

## Architecture

```text
Browser -> Next Client Component -> Next route.ts -> FastAPI -> SQLite
```

- `frontend/src/app/layout.tsx`, `frontend/src/app/page.tsx`: Server Components
- `frontend/src/features/todos/TodoApp.tsx`: Client Component
- `frontend/src/app/api/todos/**/route.ts`: BFF proxy to FastAPI
- `backend/app/api/todos.py`: Todo API

## Setup

### Backend

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
Copy-Item .env.example .env.local
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Open `http://localhost:8000/docs`.

### Frontend

```powershell
cd frontend
npm install
Copy-Item .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

## API

```text
GET    /health
GET    /todos
POST   /todos
PATCH  /todos/{id}
DELETE /todos/{id}
GET    /todos/week-counts
```

`GET /todos` query:

```text
view=daily|all
date=YYYY-MM-DD
filter=all|active|completed
search=키워드
sort=date-asc|date-desc|created-desc|created-asc
page=1
pageSize=5|10|20
```

Examples:

```text
GET /todos?date=2026-06-24&search=회의
GET /todos?view=all&date=2026-06-24&filter=active&search=회의
```

## Agentic AI Harness

이 프로젝트는 구현 결과뿐 아니라 개발 방식도 산출물입니다.

- `AGENTS.md`: Codex 작업 규칙
- `.agents/skills/todo-next-fastapi/SKILL.md`: 반복 작업용 repo skill
- `docs/harness/execution-loop.md`: Context -> Plan -> Design -> Implement -> Test -> Verify -> Review -> Record
- `docs/harness/problem-solving-loop.md`: 문제 해결 루프
- `docs/harness/verification-gates.md`: 제출 전 검증 기준
- `docs/harness/decisions/`: 아키텍처 결정 기록

## Verification

```powershell
cd backend
pytest
```

```powershell
cd frontend
npm run lint
npm run build
```

```powershell
rg "localStorage|localhost:8000|127.0.0.1:8000" frontend/src backend/app
```

`npm audit` currently reports 2 moderate findings from the generated Next.js dependency tree. They are not auto-forced because `npm audit fix --force` may introduce breaking changes.
