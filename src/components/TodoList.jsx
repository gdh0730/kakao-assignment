import { formatReadableDate } from '../lib/dateUtils.js';
import { VIEWS } from '../lib/todoUtils.js';

export default function TodoList({
  todoItems,
  currentView,
  editingTodoId,
  editText,
  onEditTextChange,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onToggle,
  onDelete,
}) {
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

function TodoItem({
  todo,
  currentView,
  isEditing,
  editText,
  onEditTextChange,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onToggle,
  onDelete,
}) {
  return (
    <li className={[
      'grid min-h-16 grid-cols-[auto_minmax(0,1fr)] items-center gap-3 rounded-lg border border-slate-200 bg-white p-3 sm:grid-cols-[auto_minmax(0,1fr)_auto]',
      todo.completed ? 'bg-slate-50' : '',
    ].join(' ')}>
      <input
        className="h-6 w-6 accent-brand"
        type="checkbox"
        checked={todo.completed}
        aria-label={`${todo.text} 완료 상태 변경`}
        onChange={() => onToggle(todo.id)}
      />

      {isEditing ? (
        <form className="col-span-1 flex flex-col gap-2 sm:flex-row" onSubmit={(event) => onSaveEdit(event, todo.id)}>
          <label className="sr-only" htmlFor={`edit-${todo.id}`}>Todo 수정 입력</label>
          <input
            className="min-h-10 flex-1 rounded-lg border border-slate-200 px-3 outline-none focus:border-brand"
            id={`edit-${todo.id}`}
            type="text"
            maxLength={80}
            value={editText}
            onChange={(event) => onEditTextChange(event.target.value)}
            autoFocus
          />
          <button className="min-h-9 rounded-lg bg-brand-soft px-3 text-sm font-bold text-brand transition hover:bg-[#e4d8ff]" type="submit">
            저장
          </button>
          <button className="min-h-9 rounded-lg bg-brand-soft px-3 text-sm font-bold text-brand transition hover:bg-[#e4d8ff]" type="button" onClick={onCancelEdit}>
            취소
          </button>
        </form>
      ) : (
        <>
          <div className="grid min-w-0 gap-1">
            {currentView === VIEWS.ALL && (
              <span className="w-fit rounded-full bg-brand-soft px-2 py-1 text-xs font-bold text-brand-dark">
                {formatReadableDate(todo.date)}
              </span>
            )}
            <span className={[
              'min-w-0 break-words font-bold',
              todo.completed ? 'text-slate-500 line-through' : 'text-ink',
            ].join(' ')}>
              {todo.text}
            </span>
          </div>

          <div className="col-span-2 flex justify-end gap-2 sm:col-span-1">
            <button className="min-h-9 rounded-lg bg-brand-soft px-3 text-sm font-bold text-brand transition hover:bg-[#e4d8ff]" type="button" onClick={() => onStartEdit(todo)}>
              수정
            </button>
            <button className="min-h-9 rounded-lg bg-red-50 px-3 text-sm font-bold text-red-600 transition hover:bg-red-100" type="button" onClick={() => onDelete(todo.id)}>
              삭제
            </button>
          </div>
        </>
      )}
    </li>
  );
}
