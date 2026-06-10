import { SORTS, VIEWS } from '../lib/todoUtils.js';

export default function ViewSortControls({ currentView, currentSort, onViewChange, onSortChange }) {
  const viewTabs = [
    { value: VIEWS.DAILY, label: '날짜별 보기' },
    { value: VIEWS.ALL, label: '전체 Todo' },
  ];

  return (
    <div className="mb-3 flex flex-col justify-between gap-3 sm:flex-row sm:items-center" aria-label="Todo 표시 방식">
      <div className="flex gap-1 rounded-lg border border-slate-200 bg-slate-50 p-1">
        {viewTabs.map((tab) => (
          <button
            key={tab.value}
            className={[
              'min-h-10 flex-1 rounded-lg px-4 font-bold transition sm:flex-none',
              currentView === tab.value ? 'bg-brand text-white' : 'text-slate-500 hover:bg-brand-soft hover:text-brand',
            ].join(' ')}
            type="button"
            aria-pressed={currentView === tab.value}
            onClick={() => onViewChange(tab.value)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <label className="flex items-center justify-between gap-2 text-sm font-bold text-slate-500" htmlFor="sortSelect">
        정렬
        <select
          className="min-h-10 rounded-lg border border-slate-200 bg-white px-3 text-ink outline-none focus:border-brand"
          id="sortSelect"
          value={currentSort}
          onChange={(event) => onSortChange(event.target.value)}
        >
          <option value={SORTS.DATE_ASC}>날짜 빠른순</option>
          <option value={SORTS.DATE_DESC}>날짜 늦은순</option>
          <option value={SORTS.CREATED_DESC}>최근 추가순</option>
          <option value={SORTS.CREATED_ASC}>오래된 추가순</option>
        </select>
      </label>
    </div>
  );
}
