import { describe, it, expect } from 'vitest';
import { NormalizedFlight } from '../src/types/flight';

const sampleFlights: NormalizedFlight[] = [
  {
    id: '1',
    airline: 'Philippine Airlines',
    airlineCode: 'PAL',
    flightNumber: 'PR 2841',
    origin: 'MNL',
    destination: 'CEB',
    departureTime: '2026-11-20T06:30:00Z',
    arrivalTime: '2026-11-20T07:55:00Z',
    durationMinutes: 85,
    stops: 0,
    cabin: 'economy',
    baggage: { carryOn: '7kg', checked: '20kg included', included: true },
    fareClass: 'Economy Saver',
    priceTotalPHP: 2850,
    currency: 'PHP',
    deepLink: 'https://philippineairlines.com',
    scrapedAt: new Date().toISOString(),
  },
  {
    id: '2',
    airline: 'Cebu Pacific',
    airlineCode: 'CEB',
    flightNumber: '5J 565',
    origin: 'MNL',
    destination: 'CEB',
    departureTime: '2026-11-20T05:15:00Z',
    arrivalTime: '2026-11-20T06:35:00Z',
    durationMinutes: 80,
    stops: 0,
    cabin: 'economy',
    baggage: { carryOn: '7kg', checked: '0kg', included: false },
    fareClass: 'Go Basic',
    priceTotalPHP: 1980,
    currency: 'PHP',
    deepLink: 'https://cebupacificair.com',
    scrapedAt: new Date().toISOString(),
  },
  {
    id: '3',
    airline: 'AirAsia',
    airlineCode: 'AXM',
    flightNumber: 'Z2 775',
    origin: 'MNL',
    destination: 'CEB',
    departureTime: '2026-11-20T19:30:00Z',
    arrivalTime: '2026-11-20T21:00:00Z',
    durationMinutes: 90,
    stops: 0,
    cabin: 'economy',
    baggage: { carryOn: '7kg', checked: '0kg', included: false },
    fareClass: 'Low Fare',
    priceTotalPHP: 2050,
    currency: 'PHP',
    deepLink: 'https://airasia.com',
    scrapedAt: new Date().toISOString(),
  },
];

describe('Results Filter & Sort Logic', () => {
  it('filters by airline', () => {
    const filtered = sampleFlights.filter(f => f.airlineCode === 'CEB');
    expect(filtered.length).toBe(1);
    expect(filtered[0].flightNumber).toBe('5J 565');
  });

  it('filters by baggage included', () => {
    const filtered = sampleFlights.filter(f => f.baggage.included);
    expect(filtered.length).toBe(1);
    expect(filtered[0].airlineCode).toBe('PAL');
  });

  it('sorts by duration and price correctly', () => {
    const sortedByPrice = [...sampleFlights].sort((a, b) => a.priceTotalPHP - b.priceTotalPHP);
    expect(sortedByPrice[0].priceTotalPHP).toBe(1980);

    const sortedByDuration = [...sampleFlights].sort((a, b) => a.durationMinutes - b.durationMinutes);
    expect(sortedByDuration[0].durationMinutes).toBe(80);
  });
});
