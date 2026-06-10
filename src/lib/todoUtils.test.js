import { describe, expect, it } from 'vitest';
import {
  FILTERS,
  getFilteredTodos,
  getPaginatedTodos,
  getTotalPages,
  loadTodoItems,
  saveTodoItems,
  SORTS,
  STORAGE_KEY,
  VIEWS,
} from './todoUtils.js';

const todos = [
  { id: '1', text: '첫 번째', completed: false, date: '2026-06-10', createdAt: '2026-06-10T01:00:00.000Z', updatedAt: '2026-06-10T01:00:00.000Z' },
  { id: '2', text: '두 번째', completed: true, date: '2026-06-11', createdAt: '2026-06-11T01:00:00.000Z', updatedAt: '2026-06-11T01:00:00.000Z' },
  { id: '3', text: '세 번째', completed: false, date: '2026-06-10', createdAt: '2026-06-10T02:00:00.000Z', updatedAt: '2026-06-10T02:00:00.000Z' },
];

function createMockStorage(value) {
  const store = new Map(value ? [[STORAGE_KEY, value]] : []);
  return {
    getItem: (key) => store.get(key) ?? null,
    setItem: (key, nextValue) => store.set(key, nextValue),
  };
}

describe('todoUtils', () => {
  it('recovers to an empty array when localStorage JSON is invalid', () => {
    expect(loadTodoItems(createMockStorage('{invalid'))).toEqual([]);
  });

  it('saves and loads todo items as JSON', () => {
    const storage = createMockStorage();
    saveTodoItems(todos, storage);
    expect(loadTodoItems(storage)).toEqual(todos);
  });

  it('filters daily active todos and keeps newest first for the same date', () => {
    const result = getFilteredTodos(todos, {
      selectedDate: '2026-06-10',
      currentView: VIEWS.DAILY,
      currentFilter: FILTERS.ACTIVE,
      currentSort: SORTS.DATE_ASC,
    });
    expect(result.map((todo) => todo.id)).toEqual(['3', '1']);
  });

  it('sorts all todos by date descending', () => {
    const result = getFilteredTodos(todos, {
      selectedDate: '2026-06-10',
      currentView: VIEWS.ALL,
      currentFilter: FILTERS.ALL,
      currentSort: SORTS.DATE_DESC,
    });
    expect(result.map((todo) => todo.id)).toEqual(['2', '3', '1']);
  });

  it('paginates filtered todos', () => {
    expect(getTotalPages(11, 5)).toBe(3);
    expect(getPaginatedTodos(todos, 2, 2).map((todo) => todo.id)).toEqual(['3']);
  });
});
