# Architecture

## Runtime Flow

```text
Browser
  -> Next Client Component
  -> Next app/api route.ts
  -> FastAPI
  -> SQLAlchemy
  -> SQLite
```

## Frontend Boundary

- `layout.tsx`와 `page.tsx`는 Server Component다.
- Todo 상호작용은 `TodoApp.tsx` Client Component에서 처리한다.
- Client Component는 `/api/todos`만 호출한다.
- 백엔드 URL은 브라우저 bundle에 포함하지 않는다.

## Backend Boundary

- FastAPI는 Todo 데이터의 source of truth다.
- 서버는 입력 검증, 필터, 정렬, 페이지네이션, 주간 카운트를 담당한다.
- SQLite 파일은 런타임 산출물이므로 Git에 커밋하지 않는다.

## Data Contract

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

