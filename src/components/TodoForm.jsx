export default function TodoForm({ todoText, onTodoTextChange, onSubmit }) {
  return (
    <form className="mt-6 flex flex-col gap-3 sm:flex-row" onSubmit={onSubmit} autoComplete="off">
      <label className="sr-only" htmlFor="todoInput">할 일 입력</label>
      <input
        className="min-h-12 flex-1 rounded-lg border border-slate-200 px-4 text-ink outline-none focus:border-brand focus:ring-4 focus:ring-brand/15"
        id="todoInput"
        type="text"
        maxLength={80}
        placeholder="오늘 할 일을 입력하세요"
        value={todoText}
        onChange={(event) => onTodoTextChange(event.target.value)}
      />
      <button className="min-h-12 rounded-lg bg-brand px-6 font-extrabold text-white transition hover:bg-brand-dark" type="submit">
        추가
      </button>
    </form>
  );
}
