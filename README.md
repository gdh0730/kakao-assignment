# React Daily Todo

Vanilla JS로 구현했던 Todo 앱을 React Function Component 구조로 마이그레이션한 과제입니다. Vite, React 18, Tailwind CSS v4, Web Storage API를 사용합니다.

## 실행 방법

```bash
npm install
npm run dev
```

프로덕션 빌드와 테스트는 아래 명령으로 확인합니다.

```bash
npm run test:run
npm run build
```

## 기술 스택

- React 18.3.1
- Vite 5.4.21
- Tailwind CSS 4.3.0
- JavaScript
- Web Storage API, `localStorage`
- Vitest, Testing Library

## 구현 기능

- Todo CRUD: 추가, 인라인 수정, 완료 처리, 삭제, 빈 입력 안내
- 상태 필터: 전체, 진행 중, 완료
- 일간/주간 뷰: 선택 날짜별 Todo, 월요일-일요일 주간 목록, 날짜별 개수
- 전체 Todo 보기: 모든 날짜 Todo를 한 목록에 표시하고 날짜 배지 제공
- 정렬: 날짜 빠른순, 날짜 늦은순, 최근 추가순, 오래된 추가순
- 페이징: 페이지당 5개, 10개, 20개 및 이전/다음 이동
- 날짜 빠른 변경: 일/월/년도 이동, 연도 입력, 월 선택, 말일 자동 보정
- localStorage: 기존 `daily-todo-items` key와 Todo schema 유지

## 프로젝트 구조

```text
todo/
├── docs/harness/
├── legacy/vanilla/
├── src/
│   ├── components/
│   ├── lib/
│   ├── App.jsx
│   ├── App.test.jsx
│   ├── index.css
│   └── main.jsx
├── index.html
├── package.json
└── vite.config.js
```

## AI 개발 Harness

AI를 활용한 개발을 반복 가능하게 만들기 위해 `docs/harness/`를 함께 관리합니다.

- `project-context.md`: 목표, 스택, 제약, 기능 범위
- `workflow.md`: 계획, 설계, 구현, 테스트, 검증, 회고 흐름
- `architecture.md`: 컴포넌트, 상태, localStorage 구조
- `test-plan.md`: 자동/수동 테스트 기준
- `maintenance.md`: 유지보수와 회귀 확인 절차
- `prompt-log.md`: AI 요청과 결과, 직접 수정한 이유
- `decisions/`: ADR 형식의 주요 의사결정 기록

## 검증

React 마이그레이션 후 기본 검증 명령은 아래 두 가지입니다.

```bash
npm run test:run
npm run build
```

실행 결과:

- `npm run test:run`: 3개 테스트 파일, 13개 테스트 통과
- `npm run build`: Vite production build 성공
- `npm audit --audit-level=moderate`: Vite 5.x가 의존하는 esbuild advisory가 보고됨. 자동 수정은 Vite 8로 올리는 breaking change라 과제의 Vite 5.x 조건을 유지하기 위해 적용하지 않음
