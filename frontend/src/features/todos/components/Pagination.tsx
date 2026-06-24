"use client";

import { PAGE_SIZES } from "../constants";
import type { PageSize } from "../types";

type PaginationProps = {
  totalItems: number;
  currentPage: number;
  totalPages: number;
  pageSize: PageSize;
  onPageSizeChange: (value: PageSize) => void;
  onMovePage: (amount: number) => void;
};

export default function Pagination({ totalItems, currentPage, totalPages, pageSize, onPageSizeChange, onMovePage }: PaginationProps) {
  if (totalItems === 0) return null;

  return (
    <nav className="mt-4 flex flex-col gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-between" aria-label="Todo 페이지 이동">
      <label className="flex items-center justify-between gap-2 text-sm font-bold text-slate-500" htmlFor="pageSizeSelect">
        페이지당
        <select className="min-h-10 border border-slate-200 bg-white px-3 text-ink outline-none focus:border-brand" id="pageSizeSelect" value={pageSize} onChange={(event) => onPageSizeChange(Number(event.target.value) as PageSize)}>
          {PAGE_SIZES.map((size) => (
            <option key={size} value={size}>
              {size}개
            </option>
          ))}
        </select>
      </label>

      <div className="flex items-center justify-between gap-2">
        <button className="min-h-10 border border-slate-200 bg-white px-3 font-bold text-brand transition hover:border-brand hover:bg-brand-soft disabled:bg-slate-100 disabled:text-slate-400" type="button" disabled={currentPage <= 1} onClick={() => onMovePage(-1)}>
          이전
        </button>
        <span className="min-w-24 text-center text-sm font-bold text-slate-500" aria-live="polite">
          {currentPage} / {totalPages}
        </span>
        <button className="min-h-10 border border-slate-200 bg-white px-3 font-bold text-brand transition hover:border-brand hover:bg-brand-soft disabled:bg-slate-100 disabled:text-slate-400" type="button" disabled={currentPage >= totalPages} onClick={() => onMovePage(1)}>
          다음
        </button>
      </div>
    </nav>
  );
}

