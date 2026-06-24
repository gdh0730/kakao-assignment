# Process Map

## Development Process

1. Requirements: 과제 요구사항과 기존 기능을 확인한다.
2. Scope: 이번 변경에서 포함할 기능과 제외할 기능을 고정한다.
3. Architecture: 프론트/백엔드/Route Handler 경계를 결정한다.
4. API Design: 요청, 응답, 검증 규칙을 정한다.
5. Data Modeling: DB 모델과 Pydantic schema를 맞춘다.
6. UI Design: 상태, 이벤트, 빈 상태, 오류 상태를 설계한다.
7. Implementation: 작은 수직 슬라이스로 구현한다.
8. Testing: 자동 테스트와 빌드를 실행한다.
9. Verification: 실제 브라우저/API 문서에서 수동 확인한다.
10. Review: diff와 위험 지점을 검토한다.
11. Maintenance: 반복되는 문제를 문서와 규칙에 반영한다.
12. Retrospective: 다음 작업에 필요한 개선점을 기록한다.

## Decision Policy

- 큰 결정은 ADR로 남긴다.
- 작은 구현 판단은 `prompt-log.md`나 관련 문서의 Decision Notes에 남긴다.

