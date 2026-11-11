'use client';

import React from 'react';
import { NormalizedFlight } from '@/types/flight';
import AirlineLogo from './AirlineLogo';
import { Clock, Luggage, ArrowRight, Zap, Award, ExternalLink, ShieldAlert } from 'lucide-react';
import { format, parseISO } from 'date-fns';

interface FareCardProps {
  flight: NormalizedFlight;
  onSelectBook: (flight: NormalizedFlight) => void;
}

export default function FareCard({ flight, onSelectBook }: FareCardProps) {
  const depTime = parseISO(flight.departureTime);
  const arrTime = parseISO(flight.arrivalTime);

  const durationHours = Math.floor(flight.durationMinutes / 60);
  const durationRemainMins = flight.durationMinutes % 60;

  // Calculate scraped time ago
  const scrapedAgo = 'Just now';

  return (
    <div
      className={`relative w-full bg-white dark:bg-slate-900 border rounded-2xl p-5 card-shadow-hover transition-all ${
        flight.isLowestPrice
          ? 'border-brand-500/70 ring-1 ring-brand-500/30'
          : 'border-slate-200/90 dark:border-slate-800'
      }`}
    >
      {/* Top Badges */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {flight.isLowestPrice && (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-500 text-white shadow-sm shadow-brand-500/30">
            <Award className="w-3.5 h-3.5" />
            Cheapest Fare
          </span>
        )}

        {flight.isFastest && (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-navy-600 text-white shadow-sm shadow-navy-600/30">
            <Zap className="w-3.5 h-3.5" />
            Fastest Flight
          </span>
        )}

        <span className="text-[11px] font-mono font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
          {flight.flightNumber}
        </span>

        <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 ml-auto">
          Updated {scrapedAgo}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Carrier Info */}
        <div className="lg:col-span-4">
          <AirlineLogo airlineCode={flight.airlineCode} airlineName={flight.airline} />
          <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <span className="font-semibold text-slate-700 dark:text-slate-300">{flight.fareClass}</span>
            <span>•</span>
            <span className="capitalize">{flight.cabin.replace('_', ' ')}</span>
          </div>
        </div>

        {/* Schedule & Flight Path */}
        <div className="lg:col-span-5 flex items-center justify-between gap-4">
          {/* Departure */}
          <div className="text-left">
            <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {format(depTime, 'HH:mm')}
            </div>
            <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {flight.origin}
            </div>
          </div>

          {/* Duration Graphic */}
          <div className="flex-1 flex flex-col items-center px-2">
            <span className="text-[11px] font-medium text-slate-400 mb-1 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {durationHours > 0 ? `${durationHours}h ` : ''}
              {durationRemainMins > 0 ? `${durationRemainMins}m` : ''}
            </span>
            <div className="w-full flex items-center relative">
              <div className="w-full h-[2px] bg-slate-200 dark:bg-slate-700"></div>
              <div className="w-2 h-2 rounded-full bg-slate-400 absolute left-0 -top-[3px]"></div>
              <div className="w-2 h-2 rounded-full bg-slate-400 absolute right-0 -top-[3px]"></div>
            </div>
            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 mt-1">
              {flight.stops === 0 ? 'Nonstop' : `${flight.stops} Stop`}
            </span>
          </div>

          {/* Arrival */}
          <div className="text-right">
            <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {format(arrTime, 'HH:mm')}
            </div>
            <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {flight.destination}
            </div>
          </div>
        </div>

        {/* Pricing & Booking Button */}
        <div className="lg:col-span-3 flex lg:flex-col items-center lg:items-end justify-between border-t lg:border-t-0 pt-4 lg:pt-0 border-slate-100 dark:border-slate-800">
          <div className="text-left lg:text-right">
            <div className="text-xs text-slate-400 font-medium">All-in total</div>
            <div className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white tracking-tight">
              ₱{flight.priceTotalPHP.toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-400 flex items-center gap-1 lg:justify-end mt-0.5">
              <Luggage className="w-3 h-3" />
              <span>{flight.baggage.checked}</span>
            </div>
          </div>

          <button
            onClick={() => onSelectBook(flight)}
            className="mt-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-brand-600 dark:bg-white dark:hover:bg-brand-400 text-white dark:text-slate-900 dark:hover:text-white font-bold text-sm flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <span>Book on {flight.airlineCode}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
