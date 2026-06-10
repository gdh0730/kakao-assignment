import { formatMonthDay, formatReadableDate, getWeekDates, getWeekdayName } from '../lib/dateUtils.js';

export default function WeekView({ weekStartDate, selectedDate, todayDate, todoItems, onMoveWeek, onSelectDate }) {
  const weekDates = getWeekDates(weekStartDate);
  const firstDate = weekDates[0];
  const lastDate = weekDates[weekDates.length - 1];

  return (
    <section className="mt-5 border-b border-slate-200 px-1 pb-5" aria-label="주간 보기">
      <div className="mb-4 flex items-center justify-between gap-3">
        <button className="min-h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm font-bold text-brand transition hover:border-brand hover:bg-brand-soft" type="button" onClick={() => onMoveWeek(-7)}>
          이전 주
        </button>
        <strong className="text-sm sm:text-base">{formatMonthDay(firstDate)} - {formatMonthDay(lastDate)}</strong>
        <button className="min-h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm font-bold text-brand transition hover:border-brand hover:bg-brand-soft" type="button" onClick={() => onMoveWeek(7)}>
          다음 주
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-7">
        {weekDates.map((dateKey) => {
          const dateTodos = todoItems.filter((todo) => todo.date === dateKey);
          const isActive = dateKey === selectedDate;
          const isToday = dateKey === todayDate;

          return (
            <button
              key={dateKey}
              className={[
                'min-h-20 rounded-lg border bg-white p-2 text-center transition hover:border-brand',
                isActive ? 'border-brand bg-brand-soft text-brand' : 'border-slate-200 text-ink',
                isToday ? 'shadow-[inset_0_0_0_2px_rgba(103,43,224,0.22)]' : '',
              ].join(' ')}
              type="button"
              aria-label={`${formatReadableDate(dateKey)} Todo ${dateTodos.length}개`}
              onClick={() => onSelectDate(dateKey)}
            >
              <span className="block text-xs text-slate-500">{getWeekdayName(dateKey)}</span>
              <span className="my-1 block text-lg font-extrabold">{Number(dateKey.slice(8, 10))}</span>
              <span className="block text-xs text-slate-500">{dateTodos.length}개</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
