'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plane, Moon, Sun, Activity, ShieldCheck, HelpCircle } from 'lucide-react';

export default function Navbar() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('theme') === 'dark' || 
       (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDark = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-navy-600 flex items-center justify-center text-white shadow-sm shadow-brand-500/20 group-hover:scale-105 transition-transform">
            <Plane className="w-5 h-5 -rotate-45" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white flex items-center gap-1">
              Low<span className="text-brand-600 dark:text-brand-400">Fares</span>
              <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded-full bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800/60 ml-1">PH</span>
            </span>
          </div>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-4">
          <Link
            href="/how-we-compare"
            className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 px-3 py-2 rounded-lg transition-colors"
          >
            <HelpCircle className="w-4 h-4 text-slate-400" />
            How we compare
          </Link>

          <Link
            href="/admin/health"
            className="flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 px-3 py-2 rounded-lg transition-colors"
            title="Provider Health Status"
          >
            <Activity className="w-4 h-4 text-emerald-500" />
            <span className="hidden md:inline">Scraper Health</span>
          </Link>

          <button
            onClick={toggleDark}
            aria-label="Toggle dark mode"
            className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>
        </nav>
      </div>
    </header>
  );
}
