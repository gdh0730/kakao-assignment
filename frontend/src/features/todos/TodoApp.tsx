"use client";

import type { FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";

import { createTodo, deleteTodo, fetchTodos, fetchWeekCounts, getApiErrorMessage, updateTodo } from "./api";
import DateNavigator from "./components/DateNavigator";
import FilterTabs from "./components/FilterTabs";
import Pagination from "./components/Pagination";
import SearchControls from "./components/SearchControls";
import TodoForm from "./components/TodoForm";
import TodoList from "./components/TodoList";
import ViewSortControls from "./components/ViewSortControls";
import WeekView from "./components/WeekView";
import { FILTERS, SORTS, VIEWS } from "./constants";
import { addDays, createClampedDateKey, formatDateKey, getWeekDates, getWeekStartDate, isYearInRange, MAX_YEAR, MIN_YEAR, parseDateKey } from "./date";
import type { FilterMode, PageSize, SortMode, Todo, ViewMode } from "./types";

type Message = {
  text: string;
  type: "error" | "success";
};

export default function TodoApp() {
  const todayDate = useMemo(() => formatDateKey(new Date()), []);
  const [todoItems, setTodoItems] = useState<Todo[]>([]);
  const [todoText, setTodoText] = useState("");
  const [selectedDate, setSelectedDate] = useState(todayDate);
  const [displayedWeekStart, setDisplayedWeekStart] = useState(() => getWeekStartDate(todayDate));
  const [currentFilter, setCurrentFilter] = useState<FilterMode>(FILTERS.ALL);
  const [searchDraft, setSearchDraft] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [currentView, setCurrentView] = useState<ViewMode>(VIEWS.DAILY);
  const [currentSort, setCurrentSort] = useState<SortMode>(SORTS.DATE_ASC);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<PageSize>(5);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [weekCounts, setWeekCounts] = useState<Record<string, number>>({});
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const [message, setMessage] = useState<Message>({ text: "", type: "error" });
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);
  const [reloadToken, setReloadToken] = useState(0);
  const [weekReloadToken, setWeekReloadToken] = useState(0);

  useEffect(() => {
    let ignore = false;

    async function loadTodos() {
      setIsLoading(true);
      try {
        const data = await fetchTodos({
          view: currentView,
          date: selectedDate,
          filter: currentFilter,
          search: activeSearch || undefined,
          sort: currentSort,
          page: currentPage,
          pageSize,
        });

        if (ignore) return;
        setTodoItems(data.items);
        setTotalItems(data.totalItems);
        setTotalPages(data.totalPages);
        if (data.page !== currentPage) {
          setCurrentPage(data.page);
        }
      } catch (error) {
        if (!ignore) showMessage(getApiErrorMessage(error));
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }

    void loadTodos();

    return () => {
      ignore = true;
    };
  }, [activeSearch, currentFilter, currentPage, currentSort, currentView, pageSize, reloadToken, selectedDate]);

  useEffect(() => {
    let ignore = false;

    async function loadWeekCounts() {
      try {
        const counts = await fetchWeekCounts(displayedWeekStart);
        if (!ignore) setWeekCounts(counts);
      } catch (error) {
        if (!ignore) showMessage(getApiErrorMessage(error));
      }
    }

    void loadWeekCounts();

    return () => {
      ignore = true;
    };
  }, [displayedWeekStart, weekReloadToken]);

  function showMessage(text: string, type: Message["type"] = "error") {
    setMessage({ text, type });
  }

  function clearMessage() {
    setMessage({ text: "", type: "error" });
  }

  function refreshData() {
    setReloadToken((value) => value + 1);
    setWeekReloadToken((value) => value + 1);
  }

  function resetListContext() {
    setEditingTodoId(null);
    setEditText("");
    setCurrentPage(1);
    clearMessage();
  }

  function selectDate(nextDate: string) {
    if (!isYearInRange(nextDate)) {
      showMessage("연도는 1900년부터 2100년 사이에서 이동할 수 있습니다.");
      return;
    }

    setSelectedDate(nextDate);
    setDisplayedWeekStart(getWeekStartDate(nextDate));
    resetListContext();
  }

  async function handleTodoSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedTodoText = todoText.trim();

    if (!trimmedTodoText) {
      showMessage("할 일을 입력한 뒤 추가해주세요.");
      return;
    }

    setIsMutating(true);
    try {
      await createTodo({ text: trimmedTodoText, date: selectedDate });
      setTodoText("");
      setEditingTodoId(null);
      setCurrentPage(1);
      refreshData();
      showMessage("Todo가 추가되었습니다.", "success");
    } catch (error) {
      showMessage(getApiErrorMessage(error));
    } finally {
      setIsMutating(false);
    }
  }

  async function handleToggleTodo(todo: Todo) {
    setIsMutating(true);
    try {
      await updateTodo(todo.id, { completed: !todo.completed });
      setEditingTodoId(null);
      refreshData();
      showMessage("완료 상태가 변경되었습니다.", "success");
    } catch (error) {
      showMessage(getApiErrorMessage(error));
    } finally {
      setIsMutating(false);
    }
  }

  function handleStartEdit(todo: Todo) {
    setEditingTodoId(todo.id);
    setEditText(todo.text);
    clearMessage();
  }

  async function handleSaveEdit(event: FormEvent<HTMLFormElement>, todoId: number) {
    event.preventDefault();
    const nextText = editText.trim();

    if (!nextText) {
      showMessage("수정할 내용을 입력해주세요.");
      return;
    }

    setIsMutating(true);
    try {
      await updateTodo(todoId, { text: nextText });
      setEditingTodoId(null);
      setEditText("");
      refreshData();
      showMessage("Todo가 수정되었습니다.", "success");
    } catch (error) {
      showMessage(getApiErrorMessage(error));
    } finally {
      setIsMutating(false);
    }
  }

  async function handleDeleteTodo(todoId: number) {
    setIsMutating(true);
    try {
      await deleteTodo(todoId);
      setEditingTodoId(null);
      setEditText("");
      refreshData();
      showMessage("Todo가 삭제되었습니다.", "success");
    } catch (error) {
      showMessage(getApiErrorMessage(error));
    } finally {
      setIsMutating(false);
    }
  }

  function moveSelectedDate(dayAmount: number) {
    selectDate(addDays(selectedDate, dayAmount));
  }

  function moveSelectedMonth(monthAmount: number) {
    const date = parseDateKey(selectedDate);
    setSelectedYearMonth(date.getFullYear(), date.getMonth() + monthAmount, date.getDate());
  }

  function moveSelectedYear(yearAmount: number) {
    const date = parseDateKey(selectedDate);
    setSelectedYearMonth(date.getFullYear() + yearAmount, date.getMonth(), date.getDate());
  }

  function changeSelectedYearMonth(year: number, monthIndex: number) {
    const currentDate = parseDateKey(selectedDate);
    setSelectedYearMonth(year, monthIndex, currentDate.getDate());
  }

  function setSelectedYearMonth(year: number, monthIndex: number, day: number) {
    const nextDate = createClampedDateKey(year, monthIndex, day);
    const nextYear = parseDateKey(nextDate).getFullYear();

    if (nextYear < MIN_YEAR || nextYear > MAX_YEAR) {
      showMessage("연도는 1900년부터 2100년 사이에서 이동할 수 있습니다.");
      return;
    }

    selectDate(nextDate);
  }

  function moveToToday() {
    selectDate(todayDate);
  }

  function moveDisplayedWeek(dayAmount: number) {
    const nextWeekStart = addDays(displayedWeekStart, dayAmount);
    const nextSelectedDate = getWeekDates(nextWeekStart)[0];

    if (!isYearInRange(nextSelectedDate)) {
      showMessage("연도는 1900년부터 2100년 사이에서 이동할 수 있습니다.");
      return;
    }

    setDisplayedWeekStart(nextWeekStart);
    setSelectedDate(nextSelectedDate);
    resetListContext();
  }

  function movePage(pageAmount: number) {
    setCurrentPage((page) => Math.min(Math.max(page + pageAmount, 1), totalPages));
    setEditingTodoId(null);
    setEditText("");
    clearMessage();
  }

  function handleSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextSearch = searchDraft.trim();
    setActiveSearch(nextSearch);
    setCurrentPage(1);
    setEditingTodoId(null);
    setEditText("");
    clearMessage();
  }

  function clearSearch() {
    setSearchDraft("");
    setActiveSearch("");
    setCurrentPage(1);
    setEditingTodoId(null);
    setEditText("");
    clearMessage();
  }

  const isBusy = isMutating;

  return (
    <main className="mx-auto w-full max-w-5xl px-3 py-6 sm:px-5 sm:py-10">
      <section className="border border-slate-200 bg-white p-5 shadow-[0_18px_50px_rgba(32,35,49,0.10)] sm:p-8" aria-labelledby="appTitle">
        <header className="mb-7 flex flex-col justify-between gap-3 border-b border-slate-200 pb-5 sm:flex-row sm:items-start">
          <div>
            <p className="mb-1 text-sm font-extrabold uppercase text-accent">Next.js + FastAPI</p>
            <h1 className="m-0 text-3xl font-extrabold leading-tight" id="appTitle">
              Daily Todo
            </h1>
          </div>
          <p className="m-0 max-w-md text-sm text-slate-500">Server API와 SQLite로 저장되는 App Router 기반 Todo 앱</p>
        </header>

        <DateNavigator
          selectedDate={selectedDate}
          todayDate={todayDate}
          onMoveDay={moveSelectedDate}
          onMoveMonth={moveSelectedMonth}
          onMoveYear={moveSelectedYear}
          onYearMonthChange={changeSelectedYearMonth}
          onInvalidYear={() => showMessage("연도는 1900년부터 2100년 사이로 입력해주세요.")}
          onMoveToday={moveToToday}
        />

        <WeekView weekStartDate={displayedWeekStart} selectedDate={selectedDate} todayDate={todayDate} counts={weekCounts} onMoveWeek={moveDisplayedWeek} onSelectDate={selectDate} />

        <TodoForm todoText={todoText} disabled={isBusy} onTodoTextChange={setTodoText} onSubmit={handleTodoSubmit} />
        <p className={`my-3 min-h-5 text-sm ${message.type === "success" ? "text-emerald-700" : "text-red-600"}`} aria-live="polite">
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
        <SearchControls
          searchDraft={searchDraft}
          activeSearch={activeSearch}
          disabled={isBusy}
          onSearchDraftChange={setSearchDraft}
          onSubmit={handleSearchSubmit}
          onClear={clearSearch}
        />
        <FilterTabs
          currentFilter={currentFilter}
          onFilterChange={(nextFilter) => {
            setCurrentFilter(nextFilter);
            resetListContext();
          }}
        />

        <section className="mt-5" aria-label="Todo 목록">
          {isLoading ? (
            <div className="border border-dashed border-slate-200 p-8 text-center text-slate-500">Todo를 불러오는 중입니다.</div>
          ) : (
            <>
              <TodoList
                todoItems={todoItems}
                currentView={currentView}
                editingTodoId={editingTodoId}
                editText={editText}
                disabled={isBusy}
                onEditTextChange={setEditText}
                onStartEdit={handleStartEdit}
                onCancelEdit={() => {
                  setEditingTodoId(null);
                  setEditText("");
                  clearMessage();
                }}
                onSaveEdit={handleSaveEdit}
                onToggle={handleToggleTodo}
                onDelete={handleDeleteTodo}
              />

              {todoItems.length === 0 && (
                <div className="grid gap-2 border border-dashed border-slate-200 p-8 text-center text-slate-500">
                  <strong className="text-ink">표시할 Todo가 없습니다.</strong>
                  <span>{activeSearch ? "검색어와 필터 조건을 확인해보세요." : currentView === VIEWS.ALL ? "전체 Todo 목록에 표시할 항목이 없습니다." : "선택한 날짜와 필터를 확인하거나 새 Todo를 추가해보세요."}</span>
                </div>
              )}

              <Pagination
                totalItems={totalItems}
                currentPage={currentPage}
                totalPages={totalPages}
                pageSize={pageSize}
                onPageSizeChange={(nextPageSize) => {
                  setPageSize(nextPageSize);
                  resetListContext();
                }}
                onMovePage={movePage}
              />
            </>
          )}
        </section>
      </section>
    </main>
  );
}
