'use client';

import React from 'react';
import { AirlineCode } from '@/types/flight';
import { SlidersHorizontal, Check, RefreshCw } from 'lucide-react';

export interface FilterState {
  airlines: AirlineCode[];
  maxStops: number | null; // null = any, 0 = nonstop only
  departureTimeWindow: 'all' | 'morning' | 'afternoon' | 'evening';
  baggageIncludedOnly: boolean;
  sortBy: 'price' | 'duration' | 'departure';
}

interface FilterSidebarProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  airlineCounts: Record<AirlineCode, number>;
  totalResults: number;
}

export default function FilterSidebar({
  filters,
  onChange,
  airlineCounts,
  totalResults,
}: FilterSidebarProps) {
  const toggleAirline = (code: AirlineCode) => {
    const exists = filters.airlines.includes(code);
    const updated = exists
      ? filters.airlines.filter((c) => c !== code)
      : [...filters.airlines, code];
    // Don't allow empty list
    if (updated.length === 0) return;
    onChange({ ...filters, airlines: updated });
  };

  const resetFilters = () => {
    onChange({
      airlines: ['PAL', 'CEB', 'AXM'],
      maxStops: null,
      departureTimeWindow: 'all',
      baggageIncludedOnly: false,
      sortBy: 'price',
    });
  };

  return (
    <div className="w-full bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 card-shadow space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-brand-600" />
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">Filters & Sort</h3>
        </div>
        <button
          onClick={resetFilters}
          className="text-xs font-semibold text-slate-400 hover:text-brand-600 dark:hover:text-brand-400"
        >
          Reset
        </button>
      </div>

      {/* Sort By */}
      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
          Sort Flights By
        </label>
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
          <button
            type="button"
            onClick={() => onChange({ ...filters, sortBy: 'price' })}
            className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
              filters.sortBy === 'price'
                ? 'bg-white dark:bg-slate-700 text-brand-700 dark:text-brand-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Price
          </button>
          <button
            type="button"
            onClick={() => onChange({ ...filters, sortBy: 'duration' })}
            className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
              filters.sortBy === 'duration'
                ? 'bg-white dark:bg-slate-700 text-brand-700 dark:text-brand-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Duration
          </button>
          <button
            type="button"
            onClick={() => onChange({ ...filters, sortBy: 'departure' })}
            className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
              filters.sortBy === 'departure'
                ? 'bg-white dark:bg-slate-700 text-brand-700 dark:text-brand-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Departure
          </button>
        </div>
      </div>

      {/* Airlines Checkbox List */}
      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
          Airlines
        </label>
        <div className="space-y-2">
          {(
            [
              { code: 'PAL', name: 'Philippine Airlines' },
              { code: 'CEB', name: 'Cebu Pacific' },
              { code: 'AXM', name: 'AirAsia' },
            ] as const
          ).map((item) => {
            const checked = filters.airlines.includes(item.code);
            const count = airlineCounts[item.code] || 0;
            return (
              <label
                key={item.code}
                onClick={() => toggleAirline(item.code)}
                className="flex items-center justify-between p-2 rounded-xl border border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer select-none transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-4 h-4 rounded-md flex items-center justify-center border text-white transition-colors ${
                      checked
                        ? 'bg-brand-600 border-brand-600'
                        : 'border-slate-300 dark:border-slate-600'
                    }`}
                  >
                    {checked && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    {item.name}
                  </span>
                </div>
                <span className="text-[11px] font-medium text-slate-400">
                  {count}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Stops */}
      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
          Stops
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onChange({ ...filters, maxStops: null })}
            className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all ${
              filters.maxStops === null
                ? 'border-brand-600 bg-brand-50/50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300'
                : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
            }`}
          >
            Any Stops
          </button>
          <button
            type="button"
            onClick={() => onChange({ ...filters, maxStops: 0 })}
            className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all ${
              filters.maxStops === 0
                ? 'border-brand-600 bg-brand-50/50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300'
                : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
            }`}
          >
            Nonstop Only
          </button>
        </div>
      </div>

      {/* Departure Window */}
      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
          Departure Time
        </label>
        <div className="grid grid-cols-2 gap-2">
          {[
            { id: 'all', label: 'All Day' },
            { id: 'morning', label: 'Morning (00-12)' },
            { id: 'afternoon', label: 'Afternoon (12-18)' },
            { id: 'evening', label: 'Evening (18-24)' },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() =>
                onChange({
                  ...filters,
                  departureTimeWindow: item.id as FilterState['departureTimeWindow'],
                })
              }
              className={`py-2 px-2.5 text-[11px] font-semibold rounded-xl border text-center transition-all ${
                filters.departureTimeWindow === item.id
                  ? 'border-brand-600 bg-brand-50/50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300 font-bold'
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Baggage Included Filter */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
        <label
          onClick={() =>
            onChange({ ...filters, baggageIncludedOnly: !filters.baggageIncludedOnly })
          }
          className="flex items-center gap-2.5 cursor-pointer select-none"
        >
          <div
            className={`w-4 h-4 rounded-md flex items-center justify-center border text-white transition-colors ${
              filters.baggageIncludedOnly
                ? 'bg-brand-600 border-brand-600'
                : 'border-slate-300 dark:border-slate-600'
            }`}
          >
            {filters.baggageIncludedOnly && <Check className="w-3 h-3 stroke-[3]" />}
          </div>
          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
            Checked baggage included
          </span>
        </label>
      </div>
    </div>
  );
}
