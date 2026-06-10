# Architecture

## 컴포넌트 구조
- `App`: 전체 상태와 이벤트 핸들러를 소유한다.
- `DateNavigator`: 일/월/년도 이동과 오늘 이동을 담당한다.
- `WeekView`: 월요일부터 일요일까지의 주간 날짜와 Todo 개수를 표시한다.
- `TodoForm`: Todo 입력과 제출을 담당한다.
- `TodoList`, `TodoItem`: 목록 표시, 완료, 수정, 삭제를 담당한다.
- `ViewSortControls`, `FilterTabs`, `Pagination`: 보기 모드, 정렬, 필터, 페이지 이동을 담당한다.

## 상태 흐름
원본 Todo 배열은 `todoItems` 하나로 유지한다. 화면에 표시할 목록은 렌더링 시점에 아래 순서로 계산한다.

1. 날짜별 보기면 `selectedDate`로 필터링하고, 전체 보기면 날짜 필터를 건너뛴다.
2. `currentFilter`로 전체/진행 중/완료를 필터링한다.
3. `currentSort`로 정렬한다.
4. `currentPage`, `pageSize`로 현재 페이지 항목만 잘라낸다.

## 저장 흐름
- 앱 시작 시 `loadTodoItems()`로 localStorage를 읽는다.
- Todo 변경 시 `saveTodoItems()`로 JSON 문자열을 저장한다.
- 저장값이 없거나 깨진 JSON이면 빈 배열로 복구한다.
