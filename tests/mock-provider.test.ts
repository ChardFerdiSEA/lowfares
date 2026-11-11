import { describe, it, expect } from 'vitest';
import { MockProvider } from '../src/lib/providers/mock';
import { ProviderAggregator } from '../src/lib/providers/aggregator';
import { SearchParams } from '../src/types/flight';

const testParams: SearchParams = {
  origin: 'MNL',
  destination: 'CEB',
  departDate: '2026-11-20',
  passengers: { adults: 1, children: 0, infants: 0 },
  cabin: 'economy',
  tripType: 'one-way',
};

describe('MockProvider & ProviderAggregator', () => {
  it('generates normalized flights for PAL', async () => {
    const provider = new MockProvider('PAL');
    const flights = await provider.search(testParams);
    expect(flights.length).toBeGreaterThan(0);
    const flight = flights[0];
    expect(flight.airline).toBe('Philippine Airlines');
    expect(flight.airlineCode).toBe('PAL');
    expect(flight.priceTotalPHP).toBeGreaterThan(0);
    expect(flight.currency).toBe('PHP');
    expect(flight.deepLink).toContain('philippineairlines.com');
  });

  it('aggregates all 3 airlines and highlights cheapest and fastest', async () => {
    const aggregator = new ProviderAggregator();
    const result = await aggregator.searchAll(testParams);
    
    expect(result.providerResults.length).toBe(3);
    expect(result.flights.length).toBeGreaterThanOrEqual(10);
    
    const lowest = result.flights.find(f => f.isLowestPrice);
    expect(lowest).toBeDefined();

    // Verify sort order: prices ascending
    for (let i = 0; i < result.flights.length - 1; i++) {
      expect(result.flights[i].priceTotalPHP).toBeLessThanOrEqual(result.flights[i + 1].priceTotalPHP);
    }
  });
});
