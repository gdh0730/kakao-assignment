"use client";

import type { FormEvent } from "react";

type SearchControlsProps = {
  searchDraft: string;
  activeSearch: string;
  disabled: boolean;
  onSearchDraftChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onClear: () => void;
};

export default function SearchControls({
  searchDraft,
  activeSearch,
  disabled,
  onSearchDraftChange,
  onSubmit,
  onClear,
}: SearchControlsProps) {
  return (
    <form className="mb-3 flex flex-col gap-2 border border-slate-200 bg-slate-50 p-3 sm:flex-row sm:items-center" role="search" onSubmit={onSubmit}>
      <label className="sr-only" htmlFor="todoSearchInput">
        Todo 검색
      </label>
      <input
        className="min-h-10 flex-1 border border-slate-200 bg-white px-3 text-ink outline-none focus:border-brand disabled:bg-slate-100"
        id="todoSearchInput"
        type="search"
        maxLength={80}
        placeholder="Todo 검색"
        value={searchDraft}
        disabled={disabled}
        onChange={(event) => onSearchDraftChange(event.target.value)}
      />
      <button className="min-h-10 bg-brand px-4 text-sm font-bold text-white transition hover:bg-brand-dark disabled:bg-slate-400" type="submit" disabled={disabled}>
        검색
      </button>
      <button className="min-h-10 border border-slate-200 bg-white px-4 text-sm font-bold text-slate-600 transition hover:border-brand hover:bg-brand-soft disabled:text-slate-400" type="button" disabled={disabled || (!activeSearch && !searchDraft)} onClick={onClear}>
        초기화
      </button>
      {activeSearch && <span className="text-sm text-slate-500">검색어: {activeSearch}</span>}
    </form>
  );
}

