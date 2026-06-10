# Maintenance

## 의존성 관리
- React는 18.x 이상을 유지한다.
- 과제 요구사항 때문에 Vite는 5.x, Tailwind CSS는 4.x 범위로 관리한다.
- 의존성 변경 후 `npm run test:run`과 `npm run build`를 실행한다.
- 현재 npm audit의 esbuild advisory는 Vite 5.x 제약과 충돌한다. 보안 우선 과제가 되면 Vite major upgrade를 별도 ADR로 결정한다.

## localStorage schema 정책
- key: `daily-todo-items`
- schema 변경이 필요하면 새 key를 바로 만들지 말고 migration 함수를 추가한다.
- 기존 schema 필드는 삭제하지 않는다.

## 회귀 확인 절차
1. CRUD 흐름 확인.
2. 필터/정렬/페이징 조합 확인.
3. 날짜별/전체 보기 전환 확인.
4. 월/년도 이동과 주간 뷰 확인.
5. localStorage 유지 확인.

## 문서 유지
- 기능 변경 시 README와 ISSUE를 갱신한다.
- 장기 영향이 있는 설계 변경은 ADR에 추가한다.
- AI가 만든 코드에서 직접 수정한 부분은 `prompt-log.md`에 기록한다.
