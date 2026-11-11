import React from 'react';
import Link from 'next/link';
import { Plane, Shield, RefreshCw } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center text-white">
                <Plane className="w-4 h-4 -rotate-45" />
              </div>
              <span className="font-bold text-lg text-slate-900 dark:text-white">LowFares</span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md leading-relaxed">
              Find the lowest fare. Skip the tabs. The fast, independent flight fare comparison engine for Philippine travelers across Philippine Airlines, Cebu Pacific, and AirAsia.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-white mb-3">Compare</h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li><Link href="/?origin=MNL&destination=CEB" className="hover:text-brand-600">Manila to Cebu</Link></li>
              <li><Link href="/?origin=MNL&destination=DVO" className="hover:text-brand-600">Manila to Davao</Link></li>
              <li><Link href="/?origin=MNL&destination=MPH" className="hover:text-brand-600">Manila to Boracay</Link></li>
              <li><Link href="/?origin=CRK&destination=KLO" className="hover:text-brand-600">Clark to Kalibo</Link></li>
              <li><Link href="/?origin=MNL&destination=SIN" className="hover:text-brand-600">Manila to Singapore</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-white mb-3">Trust & Legal</h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li><Link href="/how-we-compare" className="hover:text-brand-600">How we compare</Link></li>
              <li><Link href="/terms" className="hover:text-brand-600">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-brand-600">Privacy Policy</Link></li>
              <li><Link href="/admin/health" className="hover:text-brand-600">Scraper Status</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-100 dark:border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 dark:text-slate-500">
          <p className="text-center sm:text-left">
            LowFares is an independent comparison site and is not affiliated with Philippine Airlines, Cebu Pacific, or AirAsia. Prices are indicative and may change at booking.
          </p>
          <div className="flex items-center gap-1.5 text-slate-500 shrink-0">
            <RefreshCw className="w-3.5 h-3.5 text-brand-600 animate-spin-slow" />
            <span>Real-time fare updates</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
