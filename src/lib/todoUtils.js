export const STORAGE_KEY = 'daily-todo-items';

export const FILTERS = {
  ALL: 'all',
  ACTIVE: 'active',
  COMPLETED: 'completed',
};

export const VIEWS = {
  DAILY: 'daily',
  ALL: 'all',
};

export const SORTS = {
  DATE_ASC: 'date-asc',
  DATE_DESC: 'date-desc',
  CREATED_DESC: 'created-desc',
  CREATED_ASC: 'created-asc',
};

export function createTodoId() {
  return `todo-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function loadTodoItems(storage = window.localStorage) {
  const storedTodos = storage.getItem(STORAGE_KEY);
  if (!storedTodos) return [];

  try {
    const parsedTodos = JSON.parse(storedTodos);
    return Array.isArray(parsedTodos) ? parsedTodos : [];
  } catch {
    return [];
  }
}

export function saveTodoItems(todoItems, storage = window.localStorage) {
  storage.setItem(STORAGE_KEY, JSON.stringify(todoItems));
}

export function getFilteredTodos(todoItems, { selectedDate, currentView, currentFilter, currentSort }) {
  return todoItems
    .filter((todo) => currentView === VIEWS.ALL || todo.date === selectedDate)
    .filter((todo) => {
      if (currentFilter === FILTERS.ACTIVE) return !todo.completed;
      if (currentFilter === FILTERS.COMPLETED) return todo.completed;
      return true;
    })
    .sort((first, second) => compareTodos(first, second, currentSort));
}

export function getPaginatedTodos(todoItems, currentPage, pageSize) {
  const startIndex = (currentPage - 1) * pageSize;
  return todoItems.slice(startIndex, startIndex + pageSize);
}

export function getTotalPages(totalItems, pageSize) {
  return Math.max(Math.ceil(totalItems / pageSize), 1);
}

function compareTodos(first, second, currentSort) {
  if (currentSort === SORTS.DATE_DESC) {
    const dateCompare = second.date.localeCompare(first.date);
    if (dateCompare !== 0) return dateCompare;
    return compareCreatedAtValues(second, first);
  }

  if (currentSort === SORTS.CREATED_DESC) return compareCreatedAtValues(second, first);
  if (currentSort === SORTS.CREATED_ASC) return compareCreatedAtValues(first, second);
  return compareDateValues(first, second);
}

function compareDateValues(first, second) {
  const dateCompare = first.date.localeCompare(second.date);
  if (dateCompare !== 0) return dateCompare;
  return compareCreatedAtValues(second, first);
}

function compareCreatedAtValues(first, second) {
  return new Date(first.createdAt) - new Date(second.createdAt);
}
