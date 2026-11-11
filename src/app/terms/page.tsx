import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link href="/" className="inline-flex items-center gap-2 text-xs font-semibold text-brand-600 dark:text-brand-400 mb-6 hover:underline">
        <ArrowLeft className="w-4 h-4" />
        Back to search
      </Link>
      <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Terms of Service</h1>
      <p className="mt-2 text-xs text-slate-400">Last updated: November 2026</p>

      <div className="mt-8 space-y-6 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        <section>
          <h2 className="font-bold text-base text-slate-900 dark:text-white mb-2">1. Nature of Service</h2>
          <p>
            LowFares is an independent flight comparison engine. LowFares is not an airline, travel agency, or direct ticket seller. We provide price comparison and deep linking services to assist users in identifying available flights across Philippine carriers.
          </p>
        </section>

        <section>
          <h2 className="font-bold text-base text-slate-900 dark:text-white mb-2">2. Pricing Accuracy Disclaimer</h2>
          <p>
            All prices and availability displayed on LowFares are indicative and subject to change by the respective airlines in real time based on demand, seat inventory, and seat sale promotions. The final binding fare is confirmed exclusively on the airline&apos;s checkout page.
          </p>
        </section>

        <section>
          <h2 className="font-bold text-base text-slate-900 dark:text-white mb-2">3. Independent Operator</h2>
          <p>
            LowFares is not affiliated with, endorsed by, or sponsored by Philippine Airlines, Cebu Pacific, or AirAsia. All carrier trademarks and brand names are the property of their respective owners.
          </p>
        </section>
      </div>
    </div>
  );
}
