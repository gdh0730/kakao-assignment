# Project Context

## 목표
Vanilla JS Todo 앱을 React Function Component 기반 앱으로 마이그레이션한다. 기능은 유지하고, AI 협업 개발에 필요한 문서와 검증 구조를 함께 구축한다.

## 스택
- React 18.3.1
- Vite 5.4.21
- Tailwind CSS 4.3.0
- JavaScript
- localStorage
- Vitest, Testing Library

## 핵심 제약
- Todo 저장 key는 `daily-todo-items`를 유지한다.
- Todo schema는 `{ id, text, completed, date, createdAt, updatedAt }`를 유지한다.
- 기존 Vanilla 구현은 `legacy/vanilla/`에 보존한다.
- 기능 동작 순서는 `view/date filter -> status filter -> sort -> pagination`이다.

## 기능 범위
- CRUD, 상태 필터, 일간/주간 뷰, 전체 Todo 보기, 정렬, 페이징, 월/년도 이동, localStorage 복원.
