import { FILTERS } from '../lib/todoUtils.js';

export default function FilterTabs({ currentFilter, onFilterChange }) {
  const filters = [
    { value: FILTERS.ALL, label: '전체' },
    { value: FILTERS.ACTIVE, label: '진행 중' },
    { value: FILTERS.COMPLETED, label: '완료' },
  ];

  return (
    <div className="flex gap-1 rounded-lg border border-slate-200 bg-slate-50 p-1" role="tablist" aria-label="Todo 상태 필터">
      {filters.map((filter) => {
        const isActive = currentFilter === filter.value;

        return (
          <button
            key={filter.value}
            className={[
              'min-h-10 flex-1 rounded-lg font-bold transition',
              isActive ? 'bg-brand text-white' : 'text-slate-500 hover:bg-brand-soft hover:text-brand',
            ].join(' ')}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onFilterChange(filter.value)}
          >
            {filter.label}
          </button>
        );
      })}
    </div>
  );
}
