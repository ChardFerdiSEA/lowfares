import { NextRequest, NextResponse } from 'next/server';
import { ProviderAggregator } from '@/lib/providers/aggregator';
import { SearchParams, CabinClass } from '@/types/flight';
import { cache } from '@/lib/cache/redis';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const origin = (searchParams.get('origin') || '').toUpperCase();
  const destination = (searchParams.get('destination') || '').toUpperCase();
  const departDate = searchParams.get('departDate') || '';
  const returnDate = searchParams.get('returnDate') || undefined;
  const adults = parseInt(searchParams.get('adults') || '1', 10);
  const children = parseInt(searchParams.get('children') || '0', 10);
  const infants = parseInt(searchParams.get('infants') || '0', 10);
  const cabin = (searchParams.get('cabin') || 'economy') as CabinClass;
  const tripType = (searchParams.get('tripType') || 'one-way') as 'one-way' | 'round-trip';
  const stream = searchParams.get('stream') === 'true';

  if (!origin || !destination || !departDate) {
    return NextResponse.json(
      { error: 'origin, destination, and departDate are required parameters.' },
      { status: 400 }
    );
  }

  const queryParams: SearchParams = {
    origin,
    destination,
    departDate,
    returnDate,
    passengers: { adults, children, infants },
    cabin,
    tripType,
  };

  const cacheKey = `search:${origin}:${destination}:${departDate}:${returnDate || 'ow'}:${adults}:${children}:${cabin}`;

  // If standard JSON search requested, check cache first
  if (!stream) {
    const cached = await cache.get(cacheKey);
    if (cached) {
      return NextResponse.json({ ...cached, cached: true });
    }

    const aggregator = new ProviderAggregator();
    const result = await aggregator.searchAll(queryParams);

    // Save to cache (15 min TTL = 900 seconds)
    await cache.set(cacheKey, result, 900);

    // Log to Prisma search logs asynchronously
    try {
      await prisma.searchLog.create({
        data: {
          origin,
          destination,
          departDate,
          returnDate: returnDate || null,
          passengers: adults + children + infants,
          tripType,
          resultsCount: result.flights.length,
          cheapestFarePHP: result.cheapestFlight ? result.cheapestFlight.priceTotalPHP : null,
        },
      });

      // Log scrape metrics for health dashboard
      for (const p of result.providerResults) {
        await prisma.scrapeHealthMetric.create({
          data: {
            provider: p.airlineCode,
            status: p.error ? 'ERROR' : 'SUCCESS',
            responseTimeMs: p.durationMs,
            flightCount: p.flights.length,
            errorMessage: p.error || null,
          },
        });
      }
    } catch (e) {
      console.error('Failed to log search or metrics:', e);
    }

    return NextResponse.json({ ...result, cached: false });
  }

  // Server-Sent Events (SSE) Progressive Streaming
  const encoder = new TextEncoder();
  const readableStream = new ReadableStream({
    async start(controller) {
      const aggregator = new ProviderAggregator();
      const providers = [
        new (await import('@/lib/providers/mock')).MockProvider('PAL'),
        new (await import('@/lib/providers/mock')).MockProvider('CEB'),
        new (await import('@/lib/providers/mock')).MockProvider('AXM'),
      ];

      // Stream progress as each airline finishes
      const promises = providers.map(async (provider) => {
        const res = await aggregator.searchSingleProvider(provider, queryParams);
        const chunk = JSON.stringify({ type: 'provider_result', data: res });
        controller.enqueue(encoder.encode(`data: ${chunk}\n\n`));
        return res;
      });

      const allResults = await Promise.all(promises);
      const allFlights = allResults.flatMap((r) => r.flights);

      let cheapest = allFlights[0];
      let fastest = allFlights[0];

      allFlights.forEach((f) => {
        if (!cheapest || f.priceTotalPHP < cheapest.priceTotalPHP) cheapest = f;
        if (!fastest || f.durationMinutes < fastest.durationMinutes) fastest = f;
      });

      const finalFlights = allFlights
        .map((f) => ({
          ...f,
          isLowestPrice: cheapest && f.id === cheapest.id,
          isFastest: fastest && f.id === fastest.id,
        }))
        .sort((a, b) => a.priceTotalPHP - b.priceTotalPHP);

      // Save to cache
      await cache.set(
        cacheKey,
        {
          flights: finalFlights,
          providerResults: allResults,
          cheapestFlight: cheapest,
          fastestFlight: fastest,
        },
        900
      );

      const completeChunk = JSON.stringify({
        type: 'complete',
        data: {
          flights: finalFlights,
          cheapestFlight: cheapest,
          fastestFlight: fastest,
        },
      });
      controller.enqueue(encoder.encode(`data: ${completeChunk}\n\n`));
      controller.close();
    },
  });

  return new Response(readableStream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  });
}
