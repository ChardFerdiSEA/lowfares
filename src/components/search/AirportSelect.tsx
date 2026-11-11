'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Plane, MapPin, Search } from 'lucide-react';
import { Airport, searchAirports, getAirportByCode } from '@/lib/airports';

interface AirportSelectProps {
  label: string;
  value: string;
  onChange: (code: string) => void;
  excludeCode?: string;
  placeholder?: string;
}

export default function AirportSelect({
  label,
  value,
  onChange,
  excludeCode,
  placeholder = 'Select airport',
}: AirportSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedAirport, setSelectedAirport] = useState<Airport | undefined>(() => getAirportByCode(value));
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelectedAirport(getAirportByCode(value));
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const results = searchAirports(query, 8).filter((a) => a.code !== excludeCode);

  const handleSelect = (airport: Airport) => {
    onChange(airport.code);
    setSelectedAirport(airport);
    setIsOpen(false);
    setQuery('');
  };

  return (
    <div className="relative flex-1" ref={containerRef}>
      <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
        {label}
      </label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-14 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-left flex items-center justify-between hover:border-brand-500 dark:hover:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all card-shadow"
      >
        <div className="flex items-center gap-3 truncate">
          <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold text-xs shrink-0">
            {selectedAirport ? selectedAirport.code : '---'}
          </div>
          <div className="truncate">
            <div className="font-semibold text-sm text-slate-900 dark:text-white truncate">
              {selectedAirport ? selectedAirport.city : placeholder}
            </div>
            <div className="text-xs text-slate-400 dark:text-slate-500 truncate">
              {selectedAirport ? selectedAirport.name : 'Choose city or airport'}
            </div>
          </div>
        </div>
        <MapPin className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl p-2 max-h-80 overflow-y-auto">
          <div className="relative mb-2 px-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search airport code or city (e.g., Manila, CEB)"
              className="w-full pl-9 pr-3 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="space-y-1">
            {results.map((airport) => (
              <button
                key={airport.code}
                type="button"
                onClick={() => handleSelect(airport)}
                className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/60 flex items-center justify-between group transition-colors"
              >
                <div>
                  <div className="text-sm font-semibold text-slate-800 dark:text-slate-100 group-hover:text-brand-600 dark:group-hover:text-brand-400">
                    {airport.city} ({airport.code})
                  </div>
                  <div className="text-xs text-slate-400 truncate max-w-[220px]">
                    {airport.name}
                  </div>
                </div>
                <span className="text-xs font-mono font-medium text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-900 px-2 py-0.5 rounded">
                  {airport.country}
                </span>
              </button>
            ))}

            {results.length === 0 && (
              <div className="text-center py-6 text-sm text-slate-400">
                No matching airports found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
