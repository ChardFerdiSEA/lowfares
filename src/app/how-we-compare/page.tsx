import React from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, ShieldCheck, Zap, Database } from 'lucide-react';

export default function HowWeComparePage() {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link href="/" className="inline-flex items-center gap-2 text-xs font-semibold text-brand-600 dark:text-brand-400 mb-6 hover:underline">
        <ArrowLeft className="w-4 h-4" />
        Back to search
      </Link>

      <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
        How LowFares Compares Philippine Airlines
      </h1>
      <p className="mt-3 text-slate-500 dark:text-slate-400 leading-relaxed text-sm">
        LowFares is an independent metasearch platform built exclusively for Philippine air travel. Here is a transparent breakdown of how our engine collects, normalizes, and compares flight prices.
      </p>

      <div className="mt-10 space-y-8">
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3 mb-3">
            <Zap className="w-5 h-5 text-brand-600" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Parallel Real-time Queries</h2>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            When you perform a route search, LowFares dispatches simultaneous availability requests to Philippine Airlines, Cebu Pacific, and AirAsia. Rather than waiting for the slowest airline, results stream to your screen as each carrier returns.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3 mb-3">
            <Database className="w-5 h-5 text-teal-600" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">All-in Fare Normalization</h2>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Airlines often display promo base fares that exclude terminal fees, fuel surcharges, and aviation taxes. LowFares calculates and presents the all-in total price in Philippine Pesos (PHP) along with explicit baggage allowances (e.g. 7kg hand-carry vs. 20kg checked baggage) so you are never surprised during checkout.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3 mb-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Direct-to-Airline Booking Hand-off</h2>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            We believe you shouldn&apos;t pay extra agency fees. LowFares generates verified deep links directly into each carrier&apos;s checkout portal with your chosen flights, dates, and origin/destination airports populated. All passenger identities and payments are handled securely on the airline&apos;s verified website.
          </p>
        </div>
      </div>
    </div>
  );
}
