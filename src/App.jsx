import { useEffect, useMemo, useState } from 'react';
import DateNavigator from './components/DateNavigator.jsx';
import FilterTabs from './components/FilterTabs.jsx';
import Pagination from './components/Pagination.jsx';
import TodoForm from './components/TodoForm.jsx';
import TodoList from './components/TodoList.jsx';
import ViewSortControls from './components/ViewSortControls.jsx';
import WeekView from './components/WeekView.jsx';
import {
  addDays,
  createClampedDateKey,
  formatDateKey,
  getWeekDates,
  getWeekStartDate,
  MAX_YEAR,
  MIN_YEAR,
  parseDateKey,
} from './lib/dateUtils.js';
import {
  createTodoId,
  FILTERS,
  getFilteredTodos,
  getPaginatedTodos,
  getTotalPages,
  loadTodoItems,
  saveTodoItems,
  SORTS,
  VIEWS,
} from './lib/todoUtils.js';

export default function App() {
  const todayDate = formatDateKey(new Date());
  const [todoItems, setTodoItems] = useState(() => loadTodoItems());
  const [todoText, setTodoText] = useState('');
  const [selectedDate, setSelectedDate] = useState(todayDate);
  const [displayedWeekStart, setDisplayedWeekStart] = useState(() => getWeekStartDate(todayDate));
  const [currentFilter, setCurrentFilter] = useState(FILTERS.ALL);
  const [currentView, setCurrentView] = useState(VIEWS.DAILY);
  const [currentSort, setCurrentSort] = useState(SORTS.DATE_ASC);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [editingTodoId, setEditingTodoId] = useState(null);
  const [editText, setEditText] = useState('');
  const [message, setMessage] = useState({ text: '', type: 'error' });

  useEffect(() => {
    saveTodoItems(todoItems);
  }, [todoItems]);

  const filteredTodos = useMemo(
    () => getFilteredTodos(todoItems, { selectedDate, currentView, currentFilter, currentSort }),
    [todoItems, selectedDate, currentView, currentFilter, currentSort]
  );
  const totalPages = getTotalPages(filteredTodos.length, pageSize);
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const visibleTodos = getPaginatedTodos(filteredTodos, safeCurrentPage, pageSize);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  function showMessage(text, type = 'error') {
    setMessage({ text, type });
  }

  function clearMessage() {
    setMessage({ text: '', type: 'error' });
  }

  function resetListContext() {
    setEditingTodoId(null);
    setEditText('');
    setCurrentPage(1);
    clearMessage();
  }

  function selectDate(nextDate) {
    setSelectedDate(nextDate);
    setDisplayedWeekStart(getWeekStartDate(nextDate));
    resetListContext();
  }

  function handleTodoSubmit(event) {
    event.preventDefault();
    const trimmedTodoText = todoText.trim();

    if (!trimmedTodoText) {
      showMessage('할 일을 입력한 뒤 추가해주세요.');
      return;
    }

    const now = new Date().toISOString();
    setTodoItems((currentTodos) => [
      ...currentTodos,
      {
        id: createTodoId(),
        text: trimmedTodoText,
        completed: false,
        date: selectedDate,
        createdAt: now,
        updatedAt: now,
      },
    ]);
    setTodoText('');
    setEditingTodoId(null);
    setCurrentPage(1);
    showMessage('Todo가 추가되었습니다.', 'success');
  }

  function handleToggleTodo(todoId) {
    setTodoItems((currentTodos) =>
      currentTodos.map((todo) =>
        todo.id === todoId
          ? { ...todo, completed: !todo.completed, updatedAt: new Date().toISOString() }
          : todo
      )
    );
    setEditingTodoId(null);
    showMessage('완료 상태가 변경되었습니다.', 'success');
  }

  function handleStartEdit(todo) {
    setEditingTodoId(todo.id);
    setEditText(todo.text);
    clearMessage();
  }

  function handleSaveEdit(event, todoId) {
    event.preventDefault();
    const nextText = editText.trim();

    if (!nextText) {
      showMessage('수정할 내용을 입력해주세요.');
      return;
    }

    setTodoItems((currentTodos) =>
      currentTodos.map((todo) =>
        todo.id === todoId
          ? { ...todo, text: nextText, updatedAt: new Date().toISOString() }
          : todo
      )
    );
    setEditingTodoId(null);
    setEditText('');
    showMessage('Todo가 수정되었습니다.', 'success');
  }

  function handleDeleteTodo(todoId) {
    setTodoItems((currentTodos) => currentTodos.filter((todo) => todo.id !== todoId));
    setEditingTodoId(null);
    setEditText('');
    showMessage('Todo가 삭제되었습니다.', 'success');
  }

  function moveSelectedDate(dayAmount) {
    selectDate(addDays(selectedDate, dayAmount));
  }

  function moveSelectedMonth(monthAmount) {
    const date = parseDateKey(selectedDate);
    setSelectedYearMonth(date.getFullYear(), date.getMonth() + monthAmount, date.getDate());
  }

  function moveSelectedYear(yearAmount) {
    const date = parseDateKey(selectedDate);
    setSelectedYearMonth(date.getFullYear() + yearAmount, date.getMonth(), date.getDate());
  }

  function changeSelectedYearMonth(year, monthIndex) {
    const currentDate = parseDateKey(selectedDate);
    setSelectedYearMonth(year, monthIndex, currentDate.getDate());
  }

  function setSelectedYearMonth(year, monthIndex, day) {
    const nextDate = createClampedDateKey(year, monthIndex, day);
    const nextYear = parseDateKey(nextDate).getFullYear();

    if (nextYear < MIN_YEAR || nextYear > MAX_YEAR) {
      showMessage('연도는 1900년부터 2100년 사이에서 이동할 수 있습니다.');
      return;
    }

    selectDate(nextDate);
  }

  function moveToToday() {
    selectDate(todayDate);
  }

  function moveDisplayedWeek(dayAmount) {
    const nextWeekStart = addDays(displayedWeekStart, dayAmount);
    const nextSelectedDate = getWeekDates(nextWeekStart)[0];
    setDisplayedWeekStart(nextWeekStart);
    setSelectedDate(nextSelectedDate);
    resetListContext();
  }

  function movePage(pageAmount) {
    setCurrentPage((page) => Math.min(Math.max(page + pageAmount, 1), totalPages));
    setEditingTodoId(null);
    setEditText('');
    clearMessage();
  }

  return (
    <main className="mx-auto w-full max-w-5xl px-3 py-6 sm:px-5 sm:py-12">
      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-[0_18px_50px_rgba(32,35,49,0.12)] sm:p-8" aria-labelledby="appTitle">
        <header className="mb-7 flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
          <div>
            <p className="mb-1 text-sm font-extrabold uppercase text-brand">React Todo</p>
            <h1 className="m-0 text-3xl font-extrabold leading-tight" id="appTitle">Daily Todo</h1>
          </div>
          <p className="m-0 text-sm text-slate-500">localStorage 기반 React Function Component 앱</p>
        </header>

        <DateNavigator
          selectedDate={selectedDate}
          todayDate={todayDate}
          onMoveDay={moveSelectedDate}
          onMoveMonth={moveSelectedMonth}
          onMoveYear={moveSelectedYear}
          onYearMonthChange={changeSelectedYearMonth}
          onInvalidYear={() => showMessage('연도는 1900년부터 2100년 사이로 입력해주세요.')}
          onMoveToday={moveToToday}
        />

        <WeekView
          weekStartDate={displayedWeekStart}
          selectedDate={selectedDate}
          todayDate={todayDate}
          todoItems={todoItems}
          onMoveWeek={moveDisplayedWeek}
          onSelectDate={selectDate}
        />

        <TodoForm todoText={todoText} onTodoTextChange={setTodoText} onSubmit={handleTodoSubmit} />
        <p className={`my-3 min-h-5 text-sm ${message.type === 'success' ? 'text-emerald-700' : 'text-red-600'}`} aria-live="polite">
          {message.text}
        </p>

        <ViewSortControls
          currentView={currentView}
          currentSort={currentSort}
          onViewChange={(nextView) => {
            setCurrentView(nextView);
            resetListContext();
          }}
          onSortChange={(nextSort) => {
            setCurrentSort(nextSort);
            resetListContext();
          }}
        />
        <FilterTabs
          currentFilter={currentFilter}
          onFilterChange={(nextFilter) => {
            setCurrentFilter(nextFilter);
            resetListContext();
          }}
        />

        <section className="mt-5" aria-label="Todo 목록">
          <TodoList
            todoItems={visibleTodos}
            currentView={currentView}
            editingTodoId={editingTodoId}
            editText={editText}
            onEditTextChange={setEditText}
            onStartEdit={handleStartEdit}
            onCancelEdit={() => {
              setEditingTodoId(null);
              setEditText('');
              clearMessage();
            }}
            onSaveEdit={handleSaveEdit}
            onToggle={handleToggleTodo}
            onDelete={handleDeleteTodo}
          />

          {visibleTodos.length === 0 && (
            <div className="grid gap-2 rounded-lg border border-dashed border-slate-200 p-8 text-center text-slate-500">
              <strong className="text-ink">표시할 Todo가 없습니다.</strong>
              <span>
                {currentView === VIEWS.ALL
                  ? '전체 Todo 목록에 표시할 항목이 없습니다.'
                  : '선택한 날짜와 필터를 확인하거나 새 Todo를 추가해보세요.'}
              </span>
            </div>
          )}

          <Pagination
            totalItems={filteredTodos.length}
            currentPage={safeCurrentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            onPageSizeChange={(nextPageSize) => {
              setPageSize(nextPageSize);
              resetListContext();
            }}
            onMovePage={movePage}
          />
        </section>
      </section>
    </main>
  );
}
