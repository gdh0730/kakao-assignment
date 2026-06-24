"use client";

import type { FormEvent } from "react";

import { VIEWS } from "../constants";
import { formatReadableDate } from "../date";
import type { Todo, ViewMode } from "../types";

type TodoListProps = {
  todoItems: Todo[];
  currentView: ViewMode;
  editingTodoId: number | null;
  editText: string;
  disabled: boolean;
  onEditTextChange: (value: string) => void;
  onStartEdit: (todo: Todo) => void;
  onCancelEdit: () => void;
  onSaveEdit: (event: FormEvent<HTMLFormElement>, todoId: number) => void;
  onToggle: (todo: Todo) => void;
  onDelete: (todoId: number) => void;
};

export default function TodoList({
  todoItems,
  currentView,
  editingTodoId,
  editText,
  disabled,
  onEditTextChange,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onToggle,
  onDelete,
}: TodoListProps) {
  if (todoItems.length === 0) return null;

  return (
    <ul className="grid gap-3">
      {todoItems.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          currentView={currentView}
          isEditing={editingTodoId === todo.id}
          editText={editText}
          disabled={disabled}
          onEditTextChange={onEditTextChange}
          onStartEdit={onStartEdit}
          onCancelEdit={onCancelEdit}
          onSaveEdit={onSaveEdit}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}

type TodoItemProps = {
  todo: Todo;
  currentView: ViewMode;
  isEditing: boolean;
  editText: string;
  disabled: boolean;
  onEditTextChange: (value: string) => void;
  onStartEdit: (todo: Todo) => void;
  onCancelEdit: () => void;
  onSaveEdit: (event: FormEvent<HTMLFormElement>, todoId: number) => void;
  onToggle: (todo: Todo) => void;
  onDelete: (todoId: number) => void;
};

function TodoItem({
  todo,
  currentView,
  isEditing,
  editText,
  disabled,
  onEditTextChange,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onToggle,
  onDelete,
}: TodoItemProps) {
  return (
    <li className={["grid min-h-16 grid-cols-[auto_minmax(0,1fr)] items-center gap-3 border border-slate-200 bg-white p-3 sm:grid-cols-[auto_minmax(0,1fr)_auto]", todo.completed ? "bg-slate-50" : ""].join(" ")}>
      <input className="h-6 w-6 accent-accent" type="checkbox" checked={todo.completed} disabled={disabled} aria-label={`${todo.text} 완료 상태 변경`} onChange={() => onToggle(todo)} />

      {isEditing ? (
        <form className="col-span-1 flex flex-col gap-2 sm:flex-row" onSubmit={(event) => onSaveEdit(event, todo.id)}>
          <label className="sr-only" htmlFor={`edit-${todo.id}`}>
            Todo 수정 입력
          </label>
          <input
            className="min-h-10 flex-1 border border-slate-200 px-3 outline-none focus:border-brand disabled:bg-slate-100"
            id={`edit-${todo.id}`}
            type="text"
            maxLength={80}
            value={editText}
            disabled={disabled}
            onChange={(event) => onEditTextChange(event.target.value)}
            autoFocus
          />
          <button className="min-h-9 bg-brand-soft px-3 text-sm font-bold text-brand transition hover:bg-blue-100 disabled:text-slate-400" type="submit" disabled={disabled}>
            저장
          </button>
          <button className="min-h-9 bg-slate-100 px-3 text-sm font-bold text-slate-600 transition hover:bg-slate-200" type="button" onClick={onCancelEdit} disabled={disabled}>
            취소
          </button>
        </form>
      ) : (
        <>
          <div className="grid min-w-0 gap-1">
            {currentView === VIEWS.ALL && <span className="w-fit bg-brand-soft px-2 py-1 text-xs font-bold text-brand-dark">{formatReadableDate(todo.date)}</span>}
            <span className={["min-w-0 break-words font-bold", todo.completed ? "text-slate-500 line-through" : "text-ink"].join(" ")}>{todo.text}</span>
          </div>

          <div className="col-span-2 flex justify-end gap-2 sm:col-span-1">
            <button className="min-h-9 bg-brand-soft px-3 text-sm font-bold text-brand transition hover:bg-blue-100 disabled:text-slate-400" type="button" onClick={() => onStartEdit(todo)} disabled={disabled}>
              수정
            </button>
            <button className="min-h-9 bg-red-50 px-3 text-sm font-bold text-red-600 transition hover:bg-red-100 disabled:text-slate-400" type="button" onClick={() => onDelete(todo.id)} disabled={disabled}>
              삭제
            </button>
          </div>
        </>
      )}
    </li>
  );
}

