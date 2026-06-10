# Test Plan

## 자동 테스트
- `src/lib/dateUtils.test.js`: 날짜 formatting, 일 단위 이동, 말일 보정, 월요일 기준 주간 계산.
- `src/lib/todoUtils.test.js`: localStorage JSON 저장/복원, 잘못된 JSON 복구, 필터, 정렬, 페이징.
- `src/App.test.jsx`: Todo 생성/완료/수정/삭제, 빈 입력 안내, localStorage 저장, 필터와 페이징, 전체 보기 날짜 배지.

## 수동 테스트
- Todo 생성 후 새로고침해 데이터가 유지되는지 확인한다.
- 날짜 이동 후 날짜별 Todo가 분리되는지 확인한다.
- 전체 Todo 보기에서 다른 날짜 항목이 함께 보이는지 확인한다.
- 페이지당 개수 변경과 이전/다음 버튼을 확인한다.
- 1월 31일에서 다음 월 이동 시 2월 말일로 보정되는지 확인한다.

## 통과 기준
- `npm run test:run` 성공.
- `npm run build` 성공.
- README, ISSUE, harness 문서가 실제 구현과 일치.

## 2026-06-10 실행 기록
- `npm run test:run`: 3개 테스트 파일, 13개 테스트 통과.
- `npm run build`: production build 성공.
- `npm audit --audit-level=moderate`: Vite 5.x/esbuild advisory로 실패. 과제 조건이 Vite 5.x라 breaking upgrade는 보류.
