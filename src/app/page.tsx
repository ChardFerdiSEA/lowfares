import React from 'react';
import Link from 'next/link';
import SearchForm from '@/components/search/SearchForm';
import { ShieldCheck, Zap, Layers, ArrowRight, PlaneTakeoff, HeartHandshake } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-start pb-24">
      {/* Hero Section */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-20 pb-12 flex flex-col items-center text-center">
        {/* Subtle pill tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 dark:bg-brand-950/60 border border-brand-200/80 dark:border-brand-800 text-brand-700 dark:text-brand-300 text-xs font-semibold uppercase tracking-wider mb-6">
          <PlaneTakeoff className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
          <span>Real-time Philippine Carrier Comparison</span>
        </div>

        {/* Hero Title & Tagline */}
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-950 dark:text-white max-w-3xl leading-[1.15]">
          Find the lowest fare. <br />
          <span className="bg-gradient-to-r from-brand-600 via-teal-500 to-navy-600 bg-clip-text text-transparent">
            Skip the tabs.
          </span>
        </h1>
        <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed">
          Compare real-time domestic & international flight fares from Philippine Airlines, Cebu Pacific, and AirAsia in one unified view.
        </p>

        {/* Search Card Container */}
        <div className="w-full max-w-4xl mt-10">
          <SearchForm />
        </div>

        {/* Popular Quick Routes */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span className="font-semibold text-slate-400">Popular:</span>
          <Link
            href="/search?origin=MNL&destination=CEB&departDate=2026-11-20&tripType=one-way&adults=1&children=0&infants=0&cabin=economy"
            className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-brand-500 transition-colors"
          >
            MNL → CEB
          </Link>
          <Link
            href="/search?origin=MNL&destination=DVO&departDate=2026-11-20&tripType=one-way&adults=1&children=0&infants=0&cabin=economy"
            className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-brand-500 transition-colors"
          >
            MNL → DVO
          </Link>
          <Link
            href="/search?origin=MNL&destination=MPH&departDate=2026-11-20&tripType=one-way&adults=1&children=0&infants=0&cabin=economy"
            className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-brand-500 transition-colors"
          >
            MNL → Boracay
          </Link>
          <Link
            href="/search?origin=CRK&destination=KLO&departDate=2026-11-20&tripType=one-way&adults=1&children=0&infants=0&cabin=economy"
            className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-brand-500 transition-colors"
          >
            CRK → KLO
          </Link>
          <Link
            href="/search?origin=MNL&destination=SIN&departDate=2026-11-20&tripType=one-way&adults=1&children=0&infants=0&cabin=economy"
            className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-brand-500 transition-colors"
          >
            MNL → Singapore
          </Link>
        </div>
      </section>

      {/* Feature Highlights (Modern Minimalist Grid) */}
      <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 card-shadow">
            <div className="w-10 h-10 rounded-2xl bg-teal-50 dark:bg-teal-950/60 flex items-center justify-center text-teal-600 dark:text-teal-400 mb-4">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">Normalized Comparison</h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              We normalize fare classes, baggage allowances, and fees across Philippine Airlines, Cebu Pacific, and AirAsia so you compare apples to apples.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 card-shadow">
            <div className="w-10 h-10 rounded-2xl bg-sky-50 dark:bg-sky-950/60 flex items-center justify-center text-sky-600 dark:text-sky-400 mb-4">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">Live Parallel Streaming</h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Don't wait for slow airline websites. Results stream progressively using Server-Sent Events as each carrier availability is fetched.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 card-shadow">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">100% Direct Booking</h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Zero middleman markups. LowFares deep-links straight to each airline's checkout with your flight criteria prefilled.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
