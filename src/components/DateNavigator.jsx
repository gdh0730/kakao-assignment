import { useEffect, useState } from 'react';
import { formatReadableDate, MAX_YEAR, MIN_YEAR, parseDateKey } from '../lib/dateUtils.js';

export default function DateNavigator({
  selectedDate,
  todayDate,
  onMoveDay,
  onMoveMonth,
  onMoveYear,
  onYearMonthChange,
  onInvalidYear,
  onMoveToday,
}) {
  const selectedDateObject = parseDateKey(selectedDate);
  const [yearDraft, setYearDraft] = useState(String(selectedDateObject.getFullYear()));
  const selectedYear = selectedDateObject.getFullYear();
  const currentMonth = selectedDateObject.getMonth() + 1;

  useEffect(() => {
    setYearDraft(String(selectedYear));
  }, [selectedYear]);

  function commitYearDraft() {
    const nextYear = Number(yearDraft);

    if (!Number.isInteger(nextYear) || nextYear < MIN_YEAR || nextYear > MAX_YEAR) {
      onInvalidYear();
      setYearDraft(String(selectedYear));
      return;
    }

    onYearMonthChange(nextYear, currentMonth - 1);
  }

  return (
    <section className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4" aria-label="날짜 선택">
      <div className="flex items-center gap-3">
        <button className="grid h-11 w-11 place-items-center rounded-lg border border-slate-200 bg-white text-2xl leading-none text-brand transition hover:border-brand hover:bg-brand-soft" type="button" aria-label="이전 날짜" onClick={() => onMoveDay(-1)}>
          ‹
        </button>
        <div className="grid min-w-52 gap-1 text-center sm:text-left">
          <span className="text-sm text-slate-500">선택한 날짜</span>
          <strong className="text-xl">{formatReadableDate(selectedDate)}</strong>
        </div>
        <button className="grid h-11 w-11 place-items-center rounded-lg border border-slate-200 bg-white text-2xl leading-none text-brand transition hover:border-brand hover:bg-brand-soft" type="button" aria-label="다음 날짜" onClick={() => onMoveDay(1)}>
          ›
        </button>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2" aria-label="월과 연도 빠른 변경">
        <button className="min-h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm font-bold text-brand transition hover:border-brand hover:bg-brand-soft" type="button" onClick={() => onMoveYear(-1)}>
          이전 년
        </button>
        <button className="min-h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm font-bold text-brand transition hover:border-brand hover:bg-brand-soft" type="button" onClick={() => onMoveMonth(-1)}>
          이전 월
        </button>
        <label className="flex items-center gap-2 text-sm font-bold text-slate-500" htmlFor="yearInput">
          연도
          <input
            className="h-9 w-24 rounded-lg border border-slate-200 bg-white px-2 text-ink outline-none focus:border-brand"
            id="yearInput"
            type="number"
            min={MIN_YEAR}
            max={MAX_YEAR}
            value={yearDraft}
            onChange={(event) => setYearDraft(event.target.value)}
            onBlur={commitYearDraft}
            onKeyDown={(event) => {
              if (event.key === 'Enter') event.currentTarget.blur();
            }}
          />
        </label>
        <label className="flex items-center gap-2 text-sm font-bold text-slate-500" htmlFor="monthSelect">
          월
          <select className="h-9 rounded-lg border border-slate-200 bg-white px-2 text-ink outline-none focus:border-brand" id="monthSelect" value={currentMonth} onChange={(event) => onYearMonthChange(selectedYear, Number(event.target.value) - 1)}>
            {Array.from({ length: 12 }, (_, index) => (
              <option key={index + 1} value={index + 1}>
                {index + 1}월
              </option>
            ))}
          </select>
        </label>
        <button className="min-h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm font-bold text-brand transition hover:border-brand hover:bg-brand-soft" type="button" onClick={() => onMoveMonth(1)}>
          다음 월
        </button>
        <button className="min-h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm font-bold text-brand transition hover:border-brand hover:bg-brand-soft" type="button" onClick={() => onMoveYear(1)}>
          다음 년
        </button>
      </div>

      <button className="min-h-10 rounded-lg border border-slate-200 bg-white px-4 font-bold text-brand transition hover:border-brand hover:bg-brand-soft" type="button" onClick={onMoveToday}>
        오늘로 이동
      </button>
      <p className="w-full text-sm text-slate-500">오늘: {formatReadableDate(todayDate)}</p>
    </section>
  );
}
