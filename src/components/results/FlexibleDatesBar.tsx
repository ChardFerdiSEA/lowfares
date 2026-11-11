'use client';

import React from 'react';
import { Calendar } from 'lucide-react';

export interface DayFare {
  date: string;
  dayLabel: string;
  lowestPricePHP: number | null;
  airline: string | null;
}

interface FlexibleDatesBarProps {
  days: DayFare[];
  selectedDate: string;
  onSelectDate: (date: string) => void;
  isLoading?: boolean;
}

export default function FlexibleDatesBar({
  days,
  selectedDate,
  onSelectDate,
  isLoading,
}: FlexibleDatesBarProps) {
  if (days.length === 0 && !isLoading) return null;

  // Find lowest price among all 7 days
  const validPrices = days.filter((d) => d.lowestPricePHP !== null).map((d) => d.lowestPricePHP as number);
  const minPrice = validPrices.length > 0 ? Math.min(...validPrices) : null;

  return (
    <div className="w-full bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 card-shadow mb-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-brand-600" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            7-Day Lowest Fare Calendar
          </h3>
        </div>
        <span className="text-[11px] text-slate-400">
          Showing lowest fare per day across all 3 airlines
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
        {days.map((item) => {
          const isSelected = item.date === selectedDate;
          const isCheapestDay = minPrice !== null && item.lowestPricePHP === minPrice;

          return (
            <button
              key={item.date}
              type="button"
              onClick={() => onSelectDate(item.date)}
              className={`p-3 rounded-xl border text-center transition-all flex flex-col justify-between ${
                isSelected
                  ? 'border-brand-600 bg-brand-50/60 dark:bg-brand-950/60 ring-2 ring-brand-500/20 shadow-sm'
                  : 'border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40'
              }`}
            >
              <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                {item.dayLabel}
              </div>

              <div className="my-1.5">
                {item.lowestPricePHP ? (
                  <div className="text-sm font-black text-slate-900 dark:text-white">
                    ₱{item.lowestPricePHP.toLocaleString()}
                  </div>
                ) : (
                  <div className="text-xs text-slate-400">---</div>
                )}
              </div>

              {isCheapestDay ? (
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 rounded px-1.5 py-0.5">
                  Best Value
                </span>
              ) : item.airline ? (
                <span className="text-[10px] text-slate-400 truncate max-w-full">
                  {item.airline.replace('Philippine Airlines', 'PAL')}
                </span>
              ) : (
                <span className="text-[10px] text-transparent">-</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
