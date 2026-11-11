import { AirlineCode, FlightProvider, NormalizedFlight, ProviderSearchResult, SearchParams } from '@/types/flight';
import { MockProvider } from './mock';
import { CircuitBreaker } from './circuit-breaker';

const circuitBreakers: Record<AirlineCode, CircuitBreaker> = {
  PAL: new CircuitBreaker('Philippine Airlines'),
  CEB: new CircuitBreaker('Cebu Pacific'),
  AXM: new CircuitBreaker('AirAsia'),
};

export class ProviderAggregator {
  private providers: FlightProvider[];
  private timeoutMs: number;

  constructor(customProviders?: FlightProvider[], timeoutMs = 20000) {
    this.timeoutMs = timeoutMs;
    if (customProviders && customProviders.length > 0) {
      this.providers = customProviders;
    } else {
      // Default to mock providers for Philippine carriers
      this.providers = [
        new MockProvider('PAL'),
        new MockProvider('CEB'),
        new MockProvider('AXM'),
      ];
    }
  }

  getCircuitBreakerStatus() {
    return Object.values(circuitBreakers).map(cb => cb.getState());
  }

  async searchSingleProvider(
    provider: FlightProvider,
    params: SearchParams
  ): Promise<ProviderSearchResult> {
    const startTime = Date.now();
    const breaker = circuitBreakers[provider.airlineCode];

    if (breaker && breaker.isOpen()) {
      return {
        provider: provider.name,
        airlineCode: provider.airlineCode,
        flights: [],
        error: `Circuit breaker OPEN for ${provider.name}. Provider is temporarily paused.`,
        durationMs: 0,
        timestamp: new Date().toISOString(),
      };
    }

    try {
      // Timeout promise
      const timeoutPromise = new Promise<NormalizedFlight[]>((_, reject) =>
        setTimeout(() => reject(new Error(`Timeout after ${this.timeoutMs}ms`)), this.timeoutMs)
      );

      // Execute search with timeout
      const flights = await Promise.race([provider.search(params), timeoutPromise]);

      if (breaker) breaker.recordSuccess();

      return {
        provider: provider.name,
        airlineCode: provider.airlineCode,
        flights,
        durationMs: Date.now() - startTime,
        timestamp: new Date().toISOString(),
      };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error during scraping';
      if (breaker) breaker.recordFailure();

      return {
        provider: provider.name,
        airlineCode: provider.airlineCode,
        flights: [],
        error: errorMsg,
        durationMs: Date.now() - startTime,
        timestamp: new Date().toISOString(),
      };
    }
  }

  async searchAll(params: SearchParams): Promise<{
    flights: NormalizedFlight[];
    providerResults: ProviderSearchResult[];
    cheapestFlight?: NormalizedFlight;
    fastestFlight?: NormalizedFlight;
  }> {
    const promises = this.providers.map((p) => this.searchSingleProvider(p, params));
    const results = await Promise.all(promises);

    let allFlights: NormalizedFlight[] = [];
    results.forEach((res) => {
      if (res.flights && res.flights.length > 0) {
        allFlights = allFlights.concat(res.flights);
      }
    });

    if (allFlights.length === 0) {
      return { flights: [], providerResults: results };
    }

    // Find cheapest
    let cheapestFlight = allFlights[0];
    let fastestFlight = allFlights[0];

    allFlights.forEach((f) => {
      if (f.priceTotalPHP < cheapestFlight.priceTotalPHP) {
        cheapestFlight = f;
      }
      if (f.durationMinutes < fastestFlight.durationMinutes) {
        fastestFlight = f;
      }
    });

    // Tag lowest price & fastest
    const enrichedFlights = allFlights.map((f) => ({
      ...f,
      isLowestPrice: f.id === cheapestFlight.id,
      isFastest: f.id === fastestFlight.id,
    }));

    // Default sort: lowest price first
    enrichedFlights.sort((a, b) => a.priceTotalPHP - b.priceTotalPHP);

    return {
      flights: enrichedFlights,
      providerResults: results,
      cheapestFlight,
      fastestFlight,
    };
  }
}
