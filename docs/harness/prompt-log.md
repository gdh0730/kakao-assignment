# Prompt Log

## 2026-06-10 React 마이그레이션
- 요청: Vanilla JS Todo 앱을 React, Vite, Tailwind CSS v4로 마이그레이션하고 AI 개발에 적합한 harness 구조를 구축.
- 결과: 루트 프로젝트를 Vite React 앱으로 전환하고, 기존 Vanilla 구현은 `legacy/vanilla/`에 보존.
- 직접 수정한 이유: 기존 localStorage 데이터 호환을 유지하기 위해 storage key와 Todo schema를 변경하지 않음.

## 2026-06-10 Harness 구조 구축
- 요청: 계획, 설계, 구현, 유지보수, 테스트, 검증, 문제 해결 의사결정을 문서화할 수 있는 구조 구축.
- 결과: `docs/harness/`에 프로젝트 컨텍스트, 워크플로우, 아키텍처, 테스트 계획, 유지보수, 프롬프트 로그, ADR 문서를 추가.
- 직접 수정한 이유: AI 대화 기록이 사라져도 다음 작업자가 같은 기준으로 구현과 검증을 이어갈 수 있게 하기 위함.

## 2026-06-10 검증과 보안 메모
- 요청: 마이그레이션 결과를 테스트와 빌드로 검증.
- 결과: `npm run test:run`과 `npm run build`는 성공. `npm audit`은 Vite 5.x/esbuild advisory를 보고.
- 직접 수정한 이유: `npm audit fix --force`는 Vite 8로 올리는 breaking change라 과제의 Vite 5.x 조건과 충돌해 적용하지 않음.
