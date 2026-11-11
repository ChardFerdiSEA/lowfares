'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeftRight, Calendar, Users, ChevronDown, Sparkles, Search } from 'lucide-react';
import AirportSelect from './AirportSelect';
import { CabinClass, PassengerCount } from '@/types/flight';

interface SearchFormProps {
  initialOrigin?: string;
  initialDestination?: string;
  initialDepartDate?: string;
  initialReturnDate?: string;
  initialTripType?: 'one-way' | 'round-trip';
  initialAdults?: number;
  initialChildren?: number;
  initialInfants?: number;
  initialCabin?: CabinClass;
  compact?: boolean;
}

export default function SearchForm({
  initialOrigin = 'MNL',
  initialDestination = 'CEB',
  initialDepartDate,
  initialReturnDate,
  initialTripType = 'one-way',
  initialAdults = 1,
  initialChildren = 0,
  initialInfants = 0,
  initialCabin = 'economy',
  compact = false,
}: SearchFormProps) {
  const router = useRouter();

  // Default departure date to tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDepart = tomorrow.toISOString().split('T')[0];

  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 8);
  const defaultReturn = nextWeek.toISOString().split('T')[0];

  const [origin, setOrigin] = useState(initialOrigin);
  const [destination, setDestination] = useState(initialDestination);
  const [tripType, setTripType] = useState<'one-way' | 'round-trip'>(initialTripType);
  const [departDate, setDepartDate] = useState(initialDepartDate || defaultDepart);
  const [returnDate, setReturnDate] = useState(initialReturnDate || defaultReturn);
  const [passengers, setPassengers] = useState<PassengerCount>({
    adults: initialAdults,
    children: initialChildren,
    infants: initialInfants,
  });
  const [cabin, setCabin] = useState<CabinClass>(initialCabin);
  const [showPassengerModal, setShowPassengerModal] = useState(false);

  const swapAirports = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = new URLSearchParams({
      origin,
      destination,
      departDate,
      tripType,
      adults: passengers.adults.toString(),
      children: passengers.children.toString(),
      infants: passengers.infants.toString(),
      cabin,
    });
    if (tripType === 'round-trip' && returnDate) {
      query.set('returnDate', returnDate);
    }
    router.push(`/search?${query.toString()}`);
  };

  const totalPassengers = passengers.adults + passengers.children + passengers.infants;

  return (
    <form
      onSubmit={handleSearch}
      className={`w-full bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-4 sm:p-6 card-shadow transition-all ${
        compact ? 'shadow-sm' : 'shadow-xl'
      }`}
    >
      {/* Top Controls: Trip Type, Cabin, Passengers */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-4 pb-4 border-b border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center rounded-xl bg-slate-100 dark:bg-slate-800 p-1">
          <button
            type="button"
            onClick={() => setTripType('one-way')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              tripType === 'one-way'
                ? 'bg-white dark:bg-slate-700 text-brand-700 dark:text-brand-300 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            One-way
          </button>
          <button
            type="button"
            onClick={() => setTripType('round-trip')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              tripType === 'round-trip'
                ? 'bg-white dark:bg-slate-700 text-brand-700 dark:text-brand-300 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Round-trip
          </button>
        </div>

        {/* Passenger Picker */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowPassengerModal(!showPassengerModal)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:border-brand-500 transition-colors"
          >
            <Users className="w-3.5 h-3.5 text-slate-400" />
            <span>{totalPassengers} {totalPassengers === 1 ? 'Passenger' : 'Passengers'}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {showPassengerModal && (
            <div className="absolute top-full left-0 mt-2 z-50 w-64 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-slate-900 dark:text-white">Adults</div>
                  <div className="text-[11px] text-slate-400">Age 12+</div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={passengers.adults <= 1}
                    onClick={() => setPassengers({ ...passengers, adults: Math.max(1, passengers.adults - 1) })}
                    className="w-7 h-7 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center font-bold text-slate-600 dark:text-slate-300 disabled:opacity-40"
                  >
                    -
                  </button>
                  <span className="w-4 text-center text-xs font-semibold text-slate-800 dark:text-slate-200">{passengers.adults}</span>
                  <button
                    type="button"
                    onClick={() => setPassengers({ ...passengers, adults: passengers.adults + 1 })}
                    className="w-7 h-7 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center font-bold text-slate-600 dark:text-slate-300"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-slate-900 dark:text-white">Children</div>
                  <div className="text-[11px] text-slate-400">Age 2-11</div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={passengers.children <= 0}
                    onClick={() => setPassengers({ ...passengers, children: Math.max(0, passengers.children - 1) })}
                    className="w-7 h-7 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center font-bold text-slate-600 dark:text-slate-300 disabled:opacity-40"
                  >
                    -
                  </button>
                  <span className="w-4 text-center text-xs font-semibold text-slate-800 dark:text-slate-200">{passengers.children}</span>
                  <button
                    type="button"
                    onClick={() => setPassengers({ ...passengers, children: passengers.children + 1 })}
                    className="w-7 h-7 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center font-bold text-slate-600 dark:text-slate-300"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-slate-900 dark:text-white">Infants</div>
                  <div className="text-[11px] text-slate-400">Under 2</div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={passengers.infants <= 0}
                    onClick={() => setPassengers({ ...passengers, infants: Math.max(0, passengers.infants - 1) })}
                    className="w-7 h-7 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center font-bold text-slate-600 dark:text-slate-300 disabled:opacity-40"
                  >
                    -
                  </button>
                  <span className="w-4 text-center text-xs font-semibold text-slate-800 dark:text-slate-200">{passengers.infants}</span>
                  <button
                    type="button"
                    onClick={() => setPassengers({ ...passengers, infants: passengers.infants + 1 })}
                    className="w-7 h-7 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center font-bold text-slate-600 dark:text-slate-300"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowPassengerModal(false)}
                className="w-full py-1.5 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-semibold"
              >
                Done
              </button>
            </div>
          )}
        </div>

        {/* Cabin Class */}
        <select
          value={cabin}
          onChange={(e) => setCabin(e.target.value as CabinClass)}
          className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-brand-500 cursor-pointer"
        >
          <option value="economy">Economy</option>
          <option value="premium_economy">Premium Economy</option>
          <option value="business">Business</option>
        </select>
      </div>

      {/* Main Grid: Origin, Swap, Destination, Depart, Return */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
        {/* Origin Airport */}
        <div className="md:col-span-3">
          <AirportSelect
            label="From"
            value={origin}
            onChange={setOrigin}
            excludeCode={destination}
            placeholder="Select departure"
          />
        </div>

        {/* Swap Button */}
        <div className="flex justify-center md:col-span-1 py-1 md:py-0">
          <button
            type="button"
            onClick={swapAirports}
            title="Swap Origin and Destination"
            className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-700 hover:border-brand-500 bg-white dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-brand-600 dark:hover:text-brand-400 hover:scale-105 transition-all shadow-sm"
          >
            <ArrowLeftRight className="w-4 h-4" />
          </button>
        </div>

        {/* Destination Airport */}
        <div className="md:col-span-3">
          <AirportSelect
            label="To"
            value={destination}
            onChange={setDestination}
            excludeCode={origin}
            placeholder="Select destination"
          />
        </div>

        {/* Depart Date */}
        <div className={tripType === 'round-trip' ? 'md:col-span-2' : 'md:col-span-3'}>
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
            Departure
          </label>
          <div className="relative">
            <input
              type="date"
              required
              value={departDate}
              onChange={(e) => setDepartDate(e.target.value)}
              className="w-full h-14 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all card-shadow cursor-pointer"
            />
          </div>
        </div>

        {/* Return Date (if round-trip) */}
        {tripType === 'round-trip' && (
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
              Return
            </label>
            <div className="relative">
              <input
                type="date"
                required={tripType === 'round-trip'}
                value={returnDate}
                min={departDate}
                onChange={(e) => setReturnDate(e.target.value)}
                className="w-full h-14 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all card-shadow cursor-pointer"
              />
            </div>
          </div>
        )}

        {/* Search Submit Button */}
        <div className={tripType === 'round-trip' ? 'md:col-span-1' : 'md:col-span-2'}>
          <button
            type="submit"
            className="w-full h-14 rounded-xl bg-gradient-to-r from-brand-600 to-navy-600 hover:from-brand-500 hover:to-navy-500 text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-brand-600/25 hover:shadow-brand-600/35 transition-all transform active:scale-[0.99]"
          >
            <Search className="w-5 h-5" />
            <span className={tripType === 'round-trip' ? 'hidden xl:inline' : 'inline'}>Find Fares</span>
          </button>
        </div>
      </div>
    </form>
  );
}
