# Migration Notes

## 이전 과제와의 차이

이전 Vite React Todo 앱은 브라우저 `localStorage`가 Todo 데이터의 저장소였습니다. 이번 프로젝트에서는 FastAPI 서버와 SQLite가 데이터를 소유합니다.

## 책임 이동

- Frontend에 남는 책임: 화면 상태, 입력값, 날짜 이동, 사용자 이벤트, 로딩/에러 메시지
- Backend로 이동한 책임: Todo 저장, 조회, 수정, 삭제, 완료 상태 변경, 필터, 정렬, 페이지네이션, 주간 카운트
- Next.js Route Handler 책임: 브라우저와 FastAPI 사이의 BFF proxy

## 왜 서버 API로 전환했는가

- 새로고침과 브라우저 변경에 독립적인 저장 흐름을 경험하기 위해
- API 계약, 환경변수, 서버 검증, DB 모델을 함께 학습하기 위해
- Server Component와 Client Component 경계를 더 명확히 보기 위해

