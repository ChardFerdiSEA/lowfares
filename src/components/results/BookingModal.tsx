'use client';

import React, { useState } from 'react';
import { NormalizedFlight, SearchParams, BookingProvider } from '@/types/flight';
import { ExternalLink, X, ShieldCheck, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import AirlineLogo from './AirlineLogo';
import { format, parseISO } from 'date-fns';

interface BookingModalProps {
  flight: NormalizedFlight | null;
  searchParams: SearchParams;
  onClose: () => void;
}

// Direct Deeplink Provider implementation of BookingProvider interface
class DirectDeepLinkBookingProvider implements BookingProvider {
  id = 'direct-deeplink';
  name = 'Direct Airline Booking';
  type: 'direct_deeplink' = 'direct_deeplink';

  getBookingUrl(flight: NormalizedFlight): string {
    return flight.deepLink;
  }
}

export default function BookingModal({
  flight,
  searchParams,
  onClose,
}: BookingModalProps) {
  const [provider] = useState<BookingProvider>(() => new DirectDeepLinkBookingProvider());

  if (!flight) return null;

  const bookingUrl = provider.getBookingUrl(flight, searchParams);

  const handleProceed = () => {
    window.open(bookingUrl, '_blank', 'noopener,noreferrer');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 card-shadow shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <AirlineLogo airlineCode={flight.airlineCode} airlineName={flight.airline} />
          <h2 className="text-xl font-black text-slate-950 dark:text-white mt-4">
            Proceeding to {flight.airline}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Flight {flight.flightNumber} • {flight.origin} to {flight.destination}
          </p>
        </div>

        {/* Fare Summary Box */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-2.5 mb-6">
          <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
            <span>Cabin & Fare Class</span>
            <span className="font-semibold text-slate-900 dark:text-white capitalize">
              {flight.cabin} ({flight.fareClass})
            </span>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
            <span>Baggage</span>
            <span className="font-semibold text-slate-900 dark:text-white">
              {flight.baggage.carryOn} carry-on + {flight.baggage.checked}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
            <span>Departure</span>
            <span className="font-semibold text-slate-900 dark:text-white">
              {format(parseISO(flight.departureTime), 'EEE, MMM d, yyyy • HH:mm')}
            </span>
          </div>
          <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Total Indicative Fare
            </span>
            <span className="text-2xl font-black text-slate-950 dark:text-white">
              ₱{flight.priceTotalPHP.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Hand-off Notice & Trust Disclaimer */}
        <div className="flex items-start gap-3 p-3.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40 text-amber-900 dark:text-amber-200 text-xs mb-6">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
          <p className="leading-relaxed">
            You will complete your booking, passenger details, and payment directly on{' '}
            <strong className="font-bold">{flight.airline}&apos;s official site</strong>. LowFares never collects passenger credit card data.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-1/3 py-3 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleProceed}
            className="w-full sm:w-2/3 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-brand-600/30 transition-all"
          >
            <span>Continue to Airline Checkout</span>
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
