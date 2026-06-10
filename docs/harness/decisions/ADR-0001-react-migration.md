# ADR-0001 React Migration

## Status
Accepted

## Context
기존 Todo 앱은 HTML, CSS, Vanilla JS로 작성되어 있었다. 다음 과제는 React Function Component 구조로 변환하는 것이다.

## Decision
루트 프로젝트를 Vite React 앱으로 전환한다. 기존 Vanilla 구현은 `legacy/vanilla/`에 보존한다.

## Consequences
- `npm run dev`, `npm run build`는 React 앱을 대상으로 실행된다.
- 기존 구현은 비교와 회고를 위해 남아 있다.
- 루트 `index.html`은 Vite entrypoint가 된다.
