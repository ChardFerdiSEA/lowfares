import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link href="/" className="inline-flex items-center gap-2 text-xs font-semibold text-brand-600 dark:text-brand-400 mb-6 hover:underline">
        <ArrowLeft className="w-4 h-4" />
        Back to search
      </Link>
      <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Privacy Policy</h1>
      <p className="mt-2 text-xs text-slate-400">Last updated: November 2026</p>

      <div className="mt-8 space-y-6 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        <section>
          <h2 className="font-bold text-base text-slate-900 dark:text-white mb-2">1. Zero Personal Passenger Data Collection</h2>
          <p>
            LowFares does not collect, process, or store passenger names, passport information, government IDs, or payment details. Because booking hand-offs redirect directly to the official carrier websites, your sensitive booking data remains strictly between you and the airline.
          </p>
        </section>

        <section>
          <h2 className="font-bold text-base text-slate-900 dark:text-white mb-2">2. Anonymous Route Analytics</h2>
          <p>
            We log aggregated, anonymous search parameters (origin airport, destination airport, and requested travel dates) to optimize caching performance, identify popular routes, and monitor provider availability.
          </p>
        </section>
      </div>
    </div>
  );
}
