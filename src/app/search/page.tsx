'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import SearchForm from '@/components/search/SearchForm';
import FareCard from '@/components/results/FareCard';
import FilterSidebar, { FilterState } from '@/components/results/FilterSidebar';
import FlexibleDatesBar, { DayFare } from '@/components/results/FlexibleDatesBar';
import BookingModal from '@/components/results/BookingModal';
import { NormalizedFlight, SearchParams, CabinClass, AirlineCode, ProviderSearchResult } from '@/types/flight';
import { Plane, AlertTriangle, RefreshCw, CheckCircle, Sparkles, Filter } from 'lucide-react';
import { parseISO, getHours } from 'date-fns';

function SearchResultsContent() {
  const query = useSearchParams();

  const origin = (query.get('origin') || 'MNL').toUpperCase();
  const destination = (query.get('destination') || 'CEB').toUpperCase();
  const departDate = query.get('departDate') || new Date().toISOString().split('T')[0];
  const returnDate = query.get('returnDate') || undefined;
  const tripType = (query.get('tripType') || 'one-way') as 'one-way' | 'round-trip';
  const adults = parseInt(query.get('adults') || '1', 10);
  const children = parseInt(query.get('children') || '0', 10);
  const infants = parseInt(query.get('infants') || '0', 10);
  const cabin = (query.get('cabin') || 'economy') as CabinClass;

  const currentSearchParams: SearchParams = useMemo(() => ({
    origin,
    destination,
    departDate,
    returnDate,
    tripType,
    passengers: { adults, children, infants },
    cabin,
  }), [origin, destination, departDate, returnDate, tripType, adults, children, infants, cabin]);

  const [flights, setFlights] = useState<NormalizedFlight[]>([]);
  const [providerResults, setProviderResults] = useState<ProviderSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFlightForBooking, setSelectedFlightForBooking] = useState<NormalizedFlight | null>(null);

  // Flexible dates
  const [flexibleDays, setFlexibleDays] = useState<DayFare[]>([]);
  const [loadingFlexible, setLoadingFlexible] = useState(false);

  // Filters
  const [filters, setFilters] = useState<FilterState>({
    airlines: ['PAL', 'CEB', 'AXM'],
    maxStops: null,
    departureTimeWindow: 'all',
    baggageIncludedOnly: false,
    sortBy: 'price',
  });

  // Fetch search results progressively via SSE stream or JSON
  useEffect(() => {
    let isCancelled = false;
    setIsLoading(true);
    setFlights([]);
    setProviderResults([]);

    const eventSourceUrl = `/api/flights/search?origin=${origin}&destination=${destination}&departDate=${departDate}&tripType=${tripType}&adults=${adults}&children=${children}&infants=${infants}&cabin=${cabin}&stream=true`;
    const eventSource = new EventSource(eventSourceUrl);

    eventSource.onmessage = (event) => {
      if (isCancelled) return;
      try {
        const payload = JSON.parse(event.data);
        if (payload.type === 'provider_result') {
          const res = payload.data as ProviderSearchResult;
          setProviderResults((prev) => [...prev, res]);
          if (res.flights && res.flights.length > 0) {
            setFlights((prev) => {
              const combined = [...prev, ...res.flights];
              // Find cheapest
              let cheapest = combined[0];
              combined.forEach((f) => {
                if (f.priceTotalPHP < cheapest.priceTotalPHP) cheapest = f;
              });
              return combined.map((f) => ({
                ...f,
                isLowestPrice: f.id === cheapest.id,
              }));
            });
          }
        } else if (payload.type === 'complete') {
          setFlights(payload.data.flights);
          setIsLoading(false);
          eventSource.close();
        }
      } catch (e) {
        console.error('Error parsing SSE stream', e);
      }
    };

    eventSource.onerror = (e) => {
      console.warn('SSE stream closed or error, falling back to JSON', e);
      eventSource.close();

      // Fallback to standard JSON endpoint
      fetch(`/api/flights/search?origin=${origin}&destination=${destination}&departDate=${departDate}&tripType=${tripType}&adults=${adults}&children=${children}&infants=${infants}&cabin=${cabin}`)
        .then((res) => res.json())
        .then((data) => {
          if (!isCancelled && data.flights) {
            setFlights(data.flights);
            setProviderResults(data.providerResults || []);
          }
        })
        .catch(console.error)
        .finally(() => {
          if (!isCancelled) setIsLoading(false);
        });
    };

    return () => {
      isCancelled = true;
      eventSource.close();
    };
  }, [origin, destination, departDate, returnDate, tripType, adults, children, infants, cabin]);

  // Fetch flexible 7-day calendar
  useEffect(() => {
    setLoadingFlexible(true);
    fetch(`/api/flights/flexible-dates?origin=${origin}&destination=${destination}&departDate=${departDate}&adults=${adults}&cabin=${cabin}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.days) setFlexibleDays(data.days);
      })
      .catch(console.error)
      .finally(() => setLoadingFlexible(false));
  }, [origin, destination, departDate, adults, cabin]);

  // Calculate airline flight counts for filter sidebar
  const airlineCounts = useMemo(() => {
    const counts: Record<AirlineCode, number> = { PAL: 0, CEB: 0, AXM: 0 };
    flights.forEach((f) => {
      if (counts[f.airlineCode] !== undefined) {
        counts[f.airlineCode] += 1;
      }
    });
    return counts;
  }, [flights]);

  // Filter & Sort
  const filteredFlights = useMemo(() => {
    let result = flights.filter((flight) => {
      // Airline filter
      if (!filters.airlines.includes(flight.airlineCode)) return false;
      // Stops filter
      if (filters.maxStops !== null && flight.stops > filters.maxStops) return false;
      // Baggage filter
      if (filters.baggageIncludedOnly && !flight.baggage.included) return false;
      // Time window
      if (filters.departureTimeWindow !== 'all') {
        const hour = getHours(parseISO(flight.departureTime));
        if (filters.departureTimeWindow === 'morning' && (hour < 0 || hour >= 12)) return false;
        if (filters.departureTimeWindow === 'afternoon' && (hour < 12 || hour >= 18)) return false;
        if (filters.departureTimeWindow === 'evening' && (hour < 18 || hour > 24)) return false;
      }
      return true;
    });

    // Sorting
    result.sort((a, b) => {
      if (filters.sortBy === 'price') return a.priceTotalPHP - b.priceTotalPHP;
      if (filters.sortBy === 'duration') return a.durationMinutes - b.durationMinutes;
      if (filters.sortBy === 'departure') {
        return new Date(a.departureTime).getTime() - new Date(b.departureTime).getTime();
      }
      return 0;
    });

    return result;
  }, [flights, filters]);

  // Check if any airline is unavailable/failed
  const failedProviders = providerResults.filter((p) => p.error);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top compact search form */}
      <div className="mb-8">
        <SearchForm
          initialOrigin={origin}
          initialDestination={destination}
          initialDepartDate={departDate}
          initialReturnDate={returnDate}
          initialTripType={tripType}
          initialAdults={adults}
          initialChildren={children}
          initialInfants={infants}
          initialCabin={cabin}
          compact
        />
      </div>

      {/* Flexible 7-Day Fare Bar */}
      <FlexibleDatesBar
        days={flexibleDays}
        selectedDate={departDate}
        onSelectDate={(newDate) => {
          const url = new URL(window.location.href);
          url.searchParams.set('departDate', newDate);
          window.location.href = url.toString();
        }}
        isLoading={loadingFlexible}
      />

      {/* Warnings / Notifications for unavailable providers */}
      {failedProviders.length > 0 && (
        <div className="mb-6 space-y-2">
          {failedProviders.map((p) => (
            <div
              key={p.airlineCode}
              className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 text-xs flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  <strong>{p.provider}</strong> is currently experiencing high load or is temporarily unavailable. Showing live fares from remaining carriers.
                </span>
              </div>
              <span className="font-mono text-[11px] opacity-75">{p.error}</span>
            </div>
          ))}
        </div>
      )}

      {/* Main Grid: Filters + Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Filter Sidebar */}
        <div className="lg:col-span-4 xl:col-span-3">
          <FilterSidebar
            filters={filters}
            onChange={setFilters}
            airlineCounts={airlineCounts}
            totalResults={filteredFlights.length}
          />
        </div>

        {/* Right Fare Cards */}
        <div className="lg:col-span-8 xl:col-span-9 space-y-4">
          {/* Header count info */}
          <div className="flex items-center justify-between px-1">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>{origin} to {destination}</span>
              <span className="text-xs font-normal text-slate-400">
                ({filteredFlights.length} {filteredFlights.length === 1 ? 'flight' : 'flights'} found)
              </span>
            </h2>

            {isLoading && (
              <div className="flex items-center gap-2 text-xs font-medium text-brand-600 dark:text-brand-400">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Streaming airlines...</span>
              </div>
            )}
          </div>

          {/* Skeleton Loaders while initial stream is loading */}
          {isLoading && flights.length === 0 && (
            <div className="space-y-4">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="w-full h-36 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 animate-pulse"
                >
                  <div className="h-4 w-28 bg-slate-200 dark:bg-slate-800 rounded mb-4"></div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="h-8 bg-slate-100 dark:bg-slate-800 rounded"></div>
                    <div className="h-8 bg-slate-100 dark:bg-slate-800 rounded"></div>
                    <div className="h-8 bg-slate-100 dark:bg-slate-800 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Flight Fare Cards */}
          {filteredFlights.map((flight) => (
            <FareCard
              key={flight.id}
              flight={flight}
              onSelectBook={(f) => setSelectedFlightForBooking(f)}
            />
          ))}

          {/* Empty State */}
          {!isLoading && filteredFlights.length === 0 && (
            <div className="text-center py-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8">
              <Plane className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800 dark:text-white">No flights match your filters</h3>
              <p className="text-xs text-slate-400 mt-1">Try resetting your airline or departure time filters to view all fares.</p>
            </div>
          )}
        </div>
      </div>

      {/* Booking Hand-off Modal */}
      <BookingModal
        flight={selectedFlightForBooking}
        searchParams={currentSearchParams}
        onClose={() => setSelectedFlightForBooking(null)}
      />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm text-slate-400">Loading search...</div>}>
      <SearchResultsContent />
    </Suspense>
  );
}
