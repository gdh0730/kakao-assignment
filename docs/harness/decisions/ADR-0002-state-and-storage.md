# ADR-0002 State And Storage

## Status
Accepted

## Context
React 마이그레이션 후에도 기존 사용자의 localStorage Todo 데이터가 유지되어야 한다.

## Decision
localStorage key는 `daily-todo-items`로 유지한다. Todo schema는 `{ id, text, completed, date, createdAt, updatedAt }`를 유지한다. 화면 목록은 원본 배열을 직접 변경하지 않고 파생 계산한다.

## Consequences
- Vanilla 앱에서 저장한 데이터와 호환된다.
- 필터, 정렬, 페이징 조합을 테스트하기 쉽다.
- schema 변경이 필요할 경우 migration 정책을 먼저 문서화해야 한다.
