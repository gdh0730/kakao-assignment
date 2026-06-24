"use client";

import { FILTERS } from "../constants";
import type { FilterMode } from "../types";

type FilterTabsProps = {
  currentFilter: FilterMode;
  onFilterChange: (value: FilterMode) => void;
};

export default function FilterTabs({ currentFilter, onFilterChange }: FilterTabsProps) {
  const filters: Array<{ value: FilterMode; label: string }> = [
    { value: FILTERS.ALL, label: "전체" },
    { value: FILTERS.ACTIVE, label: "진행 중" },
    { value: FILTERS.COMPLETED, label: "완료" },
  ];

  return (
    <div className="flex gap-1 border border-slate-200 bg-slate-50 p-1" role="tablist" aria-label="Todo 상태 필터">
      {filters.map((filter) => {
        const isActive = currentFilter === filter.value;

        return (
          <button
            key={filter.value}
            className={[
              "min-h-10 flex-1 font-bold transition",
              isActive ? "bg-brand text-white" : "text-slate-500 hover:bg-brand-soft hover:text-brand",
            ].join(" ")}
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

