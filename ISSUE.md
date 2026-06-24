# 과제명: Next.js + FastAPI 기반 Todo 앱 만들기

## 1. 과제 개요

이번 과제는 기존 React(Vite) 기반 Todo 앱을 Next.js App Router 구조로 다시 설계하고, Todo 데이터 저장과 조회 책임을 FastAPI 서버로 이전하는 풀스택 프로젝트이다.

단순히 Todo 앱을 다시 만드는 것이 아니라, 프론트엔드와 백엔드의 책임을 분리하고, `localStorage` 기반 상태 관리에서 서버 API 기반 데이터 흐름으로 전환하는 과정을 학습하는 데 초점을 두었다. 또한 Codex를 일회성 코드 생성 도구로만 사용하지 않고, 프로젝트 내부 문서와 검증 루프를 기준으로 반복 작업할 수 있도록 Agentic AI 개발 하네스를 함께 구축하였다.

## 2. 과제 목표

- Next.js App Router의 파일 기반 라우팅 구조 이해
- `layout.tsx`, `page.tsx`, `route.ts`의 역할 구분
- Server Component와 Client Component의 책임 분리
- FastAPI, SQLAlchemy, SQLite 기반 Todo API 구현
- `localStorage` 저장 방식에서 서버 API + DB 저장 방식으로 전환
- Next.js Route Handler를 BFF로 사용해 프론트엔드와 백엔드 연동
- 환경변수를 통해 백엔드 API URL과 DB 설정 분리
- 필터, 정렬, 검색, 페이지네이션을 서버 쿼리로 처리
- Codex와 함께 작업하기 위한 Agentic AI 하네스, ADR, 검증 게이트 구축

## 3. 과제 위치

- 브랜치명: `week-03-구동한`
- 프로젝트 루트: `todo-next-fastapi/`
- 주요 디렉터리:
  - `frontend/`: Next.js App Router 프론트엔드
  - `backend/`: FastAPI 백엔드
  - `docs/harness/`: Agentic AI 개발 하네스 문서
  - `.agents/skills/todo-next-fastapi/`: repo-scoped Codex skill
  - `.codex/`: 선택 MCP, hooks 예시 설정

## 4. 프로젝트 구조와 파일 설명

```text
todo-next-fastapi/
├── AGENTS.md
├── README.md
├── ISSUE.md
├── .gitignore
├── .agents/
│   └── skills/
│       └── todo-next-fastapi/
│           └── SKILL.md
├── .codex/
│   ├── config.example.toml
│   ├── hooks.example.json
│   └── hooks/
├── docs/
│   ├── migration-notes.md
│   └── harness/
│       ├── architecture.md
│       ├── code-review.md
│       ├── execution-loop.md
│       ├── maintenance.md
│       ├── problem-solving-loop.md
│       ├── process-map.md
│       ├── project-context.md
│       ├── prompt-log.md
│       ├── risk-register.md
│       ├── test-plan.md
│       ├── verification-gates.md
│       └── decisions/
├── frontend/
│   ├── src/app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── globals.css
│   │   └── api/todos/
│   └── src/features/todos/
└── backend/
    ├── app/
    │   ├── main.py
    │   ├── api/todos.py
    │   ├── crud/todo.py
    │   ├── db/session.py
    │   ├── models/todo.py
    │   └── schemas/todo.py
    └── tests/test_todos.py
```

- `AGENTS.md`: Codex가 저장소에서 작업할 때 따라야 하는 공통 규칙과 검증 명령을 정의한 문서
- `.agents/skills/todo-next-fastapi/SKILL.md`: Todo, API, 문서, 검증 작업에 반복 사용할 repo-scoped skill
- `.codex/config.example.toml`: OpenAI Docs, Context7, Playwright MCP 등을 선택적으로 연결하기 위한 예시
- `.codex/hooks.example.json`: Codex hooks를 신뢰 후 활성화할 수 있도록 제공한 비활성 예시
- `docs/harness/`: 계획, 설계, 구현, 테스트, 검증, 리뷰, 유지보수, 문제 해결 과정을 정리한 Agentic AI 개발 하네스
- `docs/harness/decisions/`: 장기 의사결정을 기록한 ADR 문서
- `frontend/src/app/layout.tsx`: 앱 전체 HTML 구조, metadata, font 설정을 담당하는 Server Component
- `frontend/src/app/page.tsx`: Todo 앱 진입점을 렌더링하는 Server Component
- `frontend/src/app/api/todos/**/route.ts`: 브라우저 요청을 FastAPI로 전달하는 Next.js Route Handler
- `frontend/src/features/todos/TodoApp.tsx`: Todo 화면 상태와 사용자 이벤트를 관리하는 Client Component
- `frontend/src/features/todos/components/*`: 날짜 이동, 주간 보기, 입력 폼, 목록, 필터, 검색, 정렬, 페이지네이션 UI
- `frontend/src/features/todos/api.ts`: Next `/api/todos`를 호출하는 Axios API 클라이언트
- `backend/app/main.py`: FastAPI 앱 생성, CORS 설정, 라우터 등록, DB 테이블 생성
- `backend/app/api/todos.py`: Todo API endpoint와 query/body 검증
- `backend/app/crud/todo.py`: SQLAlchemy 조회 조건 조합과 DB 변경 로직
- `backend/app/models/todo.py`: Todo SQLAlchemy 모델
- `backend/app/schemas/todo.py`: Pydantic v2 요청/응답 schema와 검증 규칙
- `backend/tests/test_todos.py`: FastAPI API 동작을 검증하는 pytest 테스트

## 5. 프로젝트 아키텍처 설계

이번 프로젝트의 핵심 아키텍처는 브라우저가 백엔드 API를 직접 호출하지 않고, Next.js Route Handler를 거쳐 FastAPI와 통신하는 구조이다.

```text
Browser
  -> Next.js Client Component
  -> Next.js Route Handler
  -> FastAPI
  -> SQLAlchemy
  -> SQLite
```

### 5-1. Browser

사용자는 브라우저에서 Todo 입력, 수정, 삭제, 완료 토글, 날짜 이동, 상태 필터, 정렬, 검색, 페이지 이동을 수행한다.

브라우저는 FastAPI 서버 주소를 직접 알지 않는다. 모든 데이터 요청은 Next.js의 상대 경로인 `/api/todos`로만 보낸다. 이를 통해 백엔드 URL을 브라우저 번들에 노출하지 않고, 환경별 API endpoint 변경도 Next 서버 쪽에서 처리할 수 있게 했다.

### 5-2. Next.js Server Components

`frontend/src/app/layout.tsx`와 `frontend/src/app/page.tsx`는 Server Component로 유지했다.

- `layout.tsx`: 앱의 HTML 언어, font, metadata, 전역 CSS 연결 담당
- `page.tsx`: Todo 앱의 진입점 렌더링 담당

이 두 파일은 이벤트 핸들러나 브라우저 상태를 갖지 않는다. Next.js App Router의 기본 특성에 맞게 서버에서 렌더링되는 얇은 앱 껍데기 역할만 수행한다.

### 5-3. Next.js Client Components

`TodoApp.tsx`와 하위 Todo UI 컴포넌트는 `"use client"`를 선언한 Client Component이다.

Client Component가 관리하는 상태는 다음과 같다.

- Todo 입력값
- 선택 날짜
- 현재 보기 모드
- 상태 필터
- 검색어
- 정렬 기준
- 현재 페이지와 페이지 크기
- 수정 중인 Todo id와 수정 입력값
- 로딩, 성공, 오류 메시지

중요한 점은 Client Component가 Todo 데이터의 source of truth가 아니라는 것이다. 프론트엔드는 사용자가 “무엇을 보고 싶은지”를 query로 표현하고, 실제 결과 목록은 서버 응답을 렌더링한다.

### 5-4. Next.js Route Handler

`frontend/src/app/api/todos/**/route.ts`는 Backend-for-Frontend 역할을 한다.

```text
Browser -> /api/todos -> route.ts -> BACKEND_API_URL -> FastAPI
```

Route Handler는 다음 책임을 가진다.

- 브라우저 요청의 query string과 body를 FastAPI로 전달
- FastAPI 응답 status와 JSON body를 브라우저에 반환
- `BACKEND_API_URL` 환경변수를 서버 측에서만 읽음
- 브라우저에 FastAPI URL을 노출하지 않음

이 구조를 선택한 이유는 과제 요구사항인 `route.ts` 기반 연동 흐름을 명확히 보여주면서도, 실제 프로젝트에서 자주 사용하는 BFF 패턴을 경험하기 위해서이다.

### 5-5. FastAPI

FastAPI는 Todo 데이터의 source of truth이다. 프론트엔드가 전체 Todo를 받아서 직접 계산하지 않고, FastAPI가 아래 기능을 모두 처리한다.

- Todo 생성
- Todo 조회
- Todo 수정
- Todo 삭제
- 완료/진행 중 상태 변경
- 날짜 검증
- 빈 문자열과 길이 검증
- 날짜별 보기와 전체 보기
- 상태 필터
- 검색
- 정렬
- 페이지네이션
- 주간 Todo 개수 계산

특히 `GET /todos`는 화면에 표시할 목록을 서버에서 계산하는 핵심 API이다. `filter + search + sort + page` 조합이 모두 같은 SQLAlchemy query 안에서 처리되도록 설계했다.

### 5-6. SQLAlchemy + SQLite

SQLAlchemy 모델은 Todo 테이블 구조를 정의한다.

```ts
type Todo = {
  id: number;
  text: string;
  completed: boolean;
  date: string;
  createdAt: string;
  updatedAt: string;
};
```

SQLite는 로컬 개발과 과제 제출에 적합한 단일 파일 DB로 사용했다. DB 파일은 런타임 산출물이므로 `.gitignore`에 포함했고, GitHub 제출 대상에서 제외했다.

## 6. 책임 분리

| 영역 | 담당 책임 | 주요 파일 |
| --- | --- | --- |
| Next Server Component | 앱 진입점, 레이아웃, 메타데이터 | `layout.tsx`, `page.tsx` |
| Next Client Component | 사용자 이벤트, 화면 상태, UI 렌더링 | `TodoApp.tsx`, `components/*` |
| Next Route Handler | BFF proxy, 환경변수 기반 백엔드 연결 | `app/api/todos/**/route.ts` |
| FastAPI Router | API endpoint, query/body 검증 | `backend/app/api/todos.py` |
| CRUD Layer | 조회 조건 조합, DB 변경 로직 | `backend/app/crud/todo.py` |
| Model/Schema | DB 모델, API 요청/응답 타입 | `models/todo.py`, `schemas/todo.py` |
| Harness | AI 협업 절차, 검증 기준, 의사결정 기록 | `docs/harness/*`, `AGENTS.md` |

## 7. 데이터 흐름 전환

### 기존 localStorage 방식

이전 과제에서는 브라우저가 Todo 데이터 저장과 화면 계산을 모두 담당했다.

```text
Browser state -> localStorage -> Browser filtering/sorting/pagination
```

이 방식은 작은 프론트엔드 앱에서는 단순하지만, 데이터 검증, 여러 클라이언트 간 동기화, 서버 API 연동, DB 저장 흐름을 학습하기에는 한계가 있다.

### 현재 서버 API 방식

이번 과제에서는 Todo 데이터의 소유권을 FastAPI와 SQLite로 이동했다.

```text
Browser UI state -> Next /api/todos -> FastAPI query -> SQLite -> API response -> UI render
```

프론트엔드는 “선택한 날짜, 보기 모드, 필터, 검색어, 정렬, 페이지”를 query로 전달한다. 백엔드는 그 조건을 바탕으로 어떤 Todo가 결과인지 계산한다. 이 구조 덕분에 검색과 필터 조합도 서버에서 일관되게 처리할 수 있다.

## 8. API 설계

### API 목록

```text
GET    /health
GET    /todos
POST   /todos
PATCH  /todos/{id}
DELETE /todos/{id}
GET    /todos/week-counts
```

### 핵심 조회 API

```text
GET /todos
  ?view=daily|all
  &date=YYYY-MM-DD
  &filter=all|active|completed
  &search=키워드
  &sort=date-asc|date-desc|created-desc|created-asc
  &page=1
  &pageSize=5|10|20
```

- `view=daily`: 선택한 날짜의 Todo만 조회
- `view=all`: 전체 날짜 Todo 조회
- `filter=all`: 전체 Todo 조회
- `filter=active`: 미완료 Todo만 조회
- `filter=completed`: 완료 Todo만 조회
- `search`: Todo text 부분 검색
- `sort=date-asc`: 날짜 빠른순, 같은 날짜에서는 최근 생성순
- `sort=date-desc`: 날짜 늦은순, 같은 날짜에서는 최근 생성순
- `sort=created-desc`: 최근 추가순
- `sort=created-asc`: 오래된 추가순
- `page`, `pageSize`: 서버에서 페이지 결과 계산

검색 기능 예시는 다음과 같다.

```text
GET /todos?date=2026-06-24&search=회의
GET /todos?view=all&date=2026-06-24&filter=active&search=회의
```

`filter + search`는 프론트에서 따로 계산하지 않는다. FastAPI의 SQLAlchemy query에서 상태 조건과 검색 조건을 함께 적용한다.

## 9. 구현한 기능

- [x] Next.js App Router 프로젝트 구성
- [x] FastAPI 백엔드 프로젝트 구성
- [x] SQLite + SQLAlchemy Todo 모델 구성
- [x] Pydantic v2 요청/응답 schema 구성
- [x] Todo 생성
- [x] Todo 조회
- [x] Todo 수정
- [x] Todo 삭제
- [x] Todo 완료/진행 중 상태 변경
- [x] 날짜별 보기
- [x] 전체 Todo 보기
- [x] 상태 필터
- [x] 서버 기반 정렬
- [x] 서버 기반 페이지네이션
- [x] 주간 Todo 개수 조회
- [x] 서버 기반 Todo 검색
- [x] 상태 필터 + 검색 동시 적용
- [x] Next Route Handler BFF 연동
- [x] 환경변수 분리
- [x] Agentic AI 하네스 문서화

## 10. Agentic AI 설계

이번 프로젝트에서는 Codex를 단순히 “코드를 대신 생성하는 도구”로만 사용하지 않았다. 프로젝트 내부에 AI가 참고할 문서, 작업 규칙, 의사결정 기록, 검증 루프를 구축해서 다음 작업에서도 같은 기준으로 이어갈 수 있게 설계했다.

### 10-1. Agentic AI 설계 목표

- Codex가 매번 대화 맥락에만 의존하지 않도록 프로젝트 내부 문서를 기준점으로 제공한다.
- 계획, 설계, 구현, 테스트, 검증, 리뷰, 기록이 반복 가능한 루프가 되도록 한다.
- 중요한 의사결정은 ADR로 남기고, 작은 작업 판단은 `prompt-log.md`에 남긴다.
- 검증 명령과 금지 규칙을 `AGENTS.md`에 명시해 Codex가 다음 작업에서도 같은 기준을 따르게 한다.
- 프론트엔드, 백엔드, 문서 작업의 경계를 분리해서 AI가 수정해야 할 영역을 빠르게 파악할 수 있게 한다.

### 10-2. Codex 작업 표면 설계

| 도구/문서 | 역할 |
| --- | --- |
| `AGENTS.md` | Codex가 저장소에서 항상 따라야 할 작업 규칙 |
| `frontend/AGENTS.md` | Next.js App Router, Client/Server Component 규칙 |
| `backend/AGENTS.md` | FastAPI, SQLAlchemy, Pydantic 작업 규칙 |
| `.agents/skills/todo-next-fastapi/SKILL.md` | Todo/API/문서 작업 때 반복 사용할 repo skill |
| `docs/harness/process-map.md` | 전체 개발 프로세스 지도 |
| `docs/harness/execution-loop.md` | Context -> Plan -> Design -> Implement -> Test -> Verify -> Review -> Record |
| `docs/harness/problem-solving-loop.md` | 버그 발생 시 증상, 재현, 가설, 검증, 수정, 회귀 테스트 순서 |
| `docs/harness/verification-gates.md` | 완료 전 실행해야 할 검증 명령 |
| `docs/harness/decisions/*` | 장기 의사결정 ADR |
| `.codex/config.example.toml` | 선택 MCP 설정 예시 |
| `.codex/hooks.example.json` | 선택 hooks 설정 예시 |

### 10-3. Agentic 개발 루프

이 프로젝트의 작업 루프는 `docs/harness/execution-loop.md`에 정의되어 있다.

```text
Context
  -> Plan
  -> Design
  -> Implement
  -> Test
  -> Verify
  -> Review
  -> Record
```

- **Context**: 기존 코드, README, harness 문서, ADR을 먼저 확인한다.
- **Plan**: 변경 목표와 성공 기준을 정한다.
- **Design**: API 계약, 데이터 흐름, 컴포넌트 경계를 정한다.
- **Implement**: 백엔드 API, BFF Route Handler, 프론트 UI 순서로 작은 수직 슬라이스를 구현한다.
- **Test**: `pytest`, `npm run lint`, `npm run build`를 실행한다.
- **Verify**: 실제 dev server에서 API 문서, 화면, BFF 경유 요청을 확인한다.
- **Review**: 위험한 변경, 하드코딩 URL, `localStorage` 재도입 여부를 확인한다.
- **Record**: `prompt-log.md`, README, test-plan을 갱신한다.

### 10-4. 문제 해결 루프

문제가 발생했을 때는 `docs/harness/problem-solving-loop.md`의 순서를 따르도록 설계했다.

```text
Symptom
  -> Reproduction
  -> Hypotheses
  -> Cheapest Check
  -> Root Cause
  -> Fix Scope
  -> Regression Test
  -> Record
```

검색 기능을 추가했을 때도 이 방식이 적용되었다. 자동 테스트는 통과했지만 실행 중인 백엔드 dev server가 이전 코드를 들고 있어 BFF smoke test 결과가 기대와 달랐다. 이때 직접 FastAPI 응답과 OpenAPI schema를 확인했고, 서버 재시작 후 `search` 파라미터가 반영된 것을 확인했다.

## 11. 주요 아키텍처 의사결정

### 11-1. 왜 frontend/backend를 분리했는가

Next.js는 Node.js 기반 프론트엔드 프로젝트이고, FastAPI는 Python 기반 백엔드 프로젝트다. 실행 환경과 의존성이 다르기 때문에 `frontend/`, `backend/`로 분리했다.

- 관련 ADR: `docs/harness/decisions/ADR-0002-next-fastapi-boundary.md`

이 구조는 dev server를 두 개 실행해야 한다는 비용이 있지만, 과제에서 요구한 프론트엔드와 백엔드 책임 분리를 명확히 보여준다.

### 11-2. 왜 localStorage를 제거했는가

이번 과제의 핵심 목표 중 하나는 로컬 저장소 기반 Todo 앱을 서버 API 기반 데이터 흐름으로 전환하는 것이다.

- 관련 ADR: `docs/harness/decisions/ADR-0003-server-api-over-localstorage.md`

따라서 Todo 데이터의 source of truth를 브라우저가 아니라 FastAPI + SQLite로 이동했다. 프론트엔드는 UI 상태만 관리하고, Todo 목록 결과는 서버에서 계산된 응답을 사용한다.

### 11-3. 왜 Next Route Handler를 BFF로 사용했는가

브라우저가 FastAPI를 직접 호출하도록 만들 수도 있지만, 이 프로젝트에서는 Next.js Route Handler를 BFF로 사용했다.

- 관련 ADR: `docs/harness/decisions/ADR-0004-next-route-handler-bff.md`

이 결정의 이유는 다음과 같다.

- `BACKEND_API_URL`을 브라우저에 노출하지 않기 위해
- 과제 요구사항인 `route.ts` 기반 연동 흐름을 명확히 보여주기 위해
- 브라우저에서는 `/api/todos`라는 안정적인 상대 경로만 사용하게 하기 위해

### 11-4. 왜 Agentic AI 하네스를 포함했는가

이번 프로젝트는 AI를 단순 코드 생성 도구로 사용하는 것이 아니라, 구현 보조와 검증 루프를 함께 수행하는 개발 방식 자체를 보여주는 것을 목표로 했다.

- 관련 ADR: `docs/harness/decisions/ADR-0005-agentic-ai-harness.md`

따라서 `AGENTS.md`, `docs/harness/`, ADR, prompt-log, repo skill을 포함했다. 이를 통해 Codex가 다음 작업에서도 프로젝트 기준을 빠르게 회복하고, 동일한 검증 절차를 반복할 수 있다.

## 12. AI 활용 플로우

1. 기존 React(Vite) Todo 앱의 기능 범위를 확인했다.
2. 새 과제를 기존 프로젝트와 독립된 `todo-next-fastapi` 저장소로 구성하기로 결정했다.
3. `frontend/`, `backend/`, `docs/harness/`, `.agents/skills/`, `.codex/` 구조를 설계했다.
4. `AGENTS.md`와 harness 문서를 먼저 작성해 Codex가 따를 기준을 만들었다.
5. ADR을 통해 독립 저장소, 프론트/백엔드 경계, 서버 API 전환, BFF Route Handler, Agentic AI 하네스 포함 결정을 기록했다.
6. FastAPI 백엔드에서 Todo CRUD, 필터, 정렬, 페이지네이션, 주간 카운트 API를 구현했다.
7. pytest로 백엔드 API 계약을 먼저 검증했다.
8. Next.js App Router에서 Server Component 진입점과 Client Component Todo UI를 구현했다.
9. Next Route Handler를 통해 브라우저와 FastAPI 사이의 BFF proxy를 구현했다.
10. 서버 기반 검색 기능을 추가하고 `filter=active&search=키워드` 조합을 테스트했다.
11. `npm run lint`, `npm run build`, `pytest`, source scan, BFF smoke test를 실행했다.
12. 구현 결과와 검증 내용을 `prompt-log.md`, README, test-plan에 반영했다.

## 13. 구현하면서 고민한 점

### 고민 1. Server Component와 Client Component를 어디서 나눌 것인가

Todo 앱은 입력, 수정, 삭제, 필터, 검색처럼 상호작용이 많다. 모든 것을 Client Component로 만들면 App Router의 Server Component 학습 목표가 약해질 수 있다.

**해결 방법**

`layout.tsx`와 `page.tsx`는 Server Component로 유지하고, 상호작용이 필요한 Todo UI만 `TodoApp.tsx` 이하 Client Component로 분리했다.

### 고민 2. Agentic AI 문서를 어떻게 실제 작업에 연결할 것인가

문서를 많이 만들어도 Codex가 실제로 참고하지 않으면 단순한 산출물 목록에 그칠 수 있다.

**해결 방법**

`AGENTS.md`에 작업 전 harness와 ADR을 확인하도록 명시했다. 또한 repo-scoped skill인 `.agents/skills/todo-next-fastapi/SKILL.md`에 Todo/API/문서 작업 루프를 적어 반복 작업에서 재사용할 수 있게 했다.

## 14. 검증 내역

### Backend

```powershell
cd backend
pytest
```

결과: `6 passed`

검증 범위:

- health check
- Todo 생성, 조회, 수정, 삭제
- 입력 검증
- 날짜 검증
- 필터, 정렬, 페이지네이션
- 검색
- 필터 + 검색 조합
- 주간 Todo 개수
- 존재하지 않는 Todo 404

### Frontend

```powershell
cd frontend
npm run lint
npm run build
```

결과:

- ESLint 통과
- Next.js production build 통과

### Source Scan

```powershell
rg "localStorage|localhost:8000|127.0.0.1:8000" frontend/src backend/app
```

결과:

- source code 내 `localStorage` 없음
- source code 내 백엔드 URL 하드코딩 없음

### Manual / Smoke Test

- `http://localhost:3000` 접속 확인
- `http://localhost:8000/docs` 접속 확인
- BFF 경유 Todo 생성, 수정, 완료, 삭제 확인
- BFF 경유 검색 확인
- `filter=active&search=키워드` 조합 확인
- 새로고침 후 SQLite 데이터 유지 확인

## 15. 과제 회고

### 잘한 점

- Next.js App Router와 FastAPI의 책임을 명확히 나눴다.
- `localStorage`를 제거하고 서버 API + SQLite 기반 데이터 흐름으로 전환했다.
- Next Route Handler를 BFF로 사용해 환경변수와 API 연동 흐름을 분리했다.

### 아쉬운 점

- 프론트엔드 자동 테스트는 아직 `lint`, `build`, 수동 검증 중심이다.
- SQLite 테이블 생성은 과제 규모에 맞춰 앱 시작 시 자동 생성으로 처리했지만, 실제 운영 환경이라면 Alembic 같은 마이그레이션 도구가 필요하다.

### 다음에 시도해볼 것

- Playwright 기반 E2E 테스트 추가
- GitHub Actions CI 구성
- Agentic AI hooks를 신뢰 후 활성화해 Stop 시점 자동 검증 실험

