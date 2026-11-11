import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { ProviderAggregator } from '@/lib/providers/aggregator';
import { cache } from '@/lib/cache/redis';

export async function GET() {
  const aggregator = new ProviderAggregator();
  const circuitBreakers = aggregator.getCircuitBreakerStatus();

  // Get recent scrape metrics grouped by provider
  let metricsSummary: Record<string, { total: number; success: number; error: number; avgTimeMs: number }> = {
    PAL: { total: 0, success: 0, error: 0, avgTimeMs: 0 },
    CEB: { total: 0, success: 0, error: 0, avgTimeMs: 0 },
    AXM: { total: 0, success: 0, error: 0, avgTimeMs: 0 },
  };

  try {
    const recentMetrics = await prisma.scrapeHealthMetric.findMany({
      take: 100,
      orderBy: { timestamp: 'desc' },
    });

    recentMetrics.forEach((m) => {
      if (!metricsSummary[m.provider]) {
        metricsSummary[m.provider] = { total: 0, success: 0, error: 0, avgTimeMs: 0 };
      }
      const entry = metricsSummary[m.provider];
      entry.total += 1;
      if (m.status === 'SUCCESS') entry.success += 1;
      else entry.error += 1;
      entry.avgTimeMs += m.responseTimeMs;
    });

    Object.keys(metricsSummary).forEach((k) => {
      const entry = metricsSummary[k];
      if (entry.total > 0) {
        entry.avgTimeMs = Math.round(entry.avgTimeMs / entry.total);
      }
    });
  } catch (e) {
    console.error('Failed reading scrape metrics from DB:', e);
  }

  return NextResponse.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    circuitBreakers,
    metricsSummary,
    cacheEntriesCount: cache.size(),
    environment: {
      useMockData: process.env.USE_MOCK_DATA === 'true',
      nodeEnv: process.env.NODE_ENV,
    },
  });
}
