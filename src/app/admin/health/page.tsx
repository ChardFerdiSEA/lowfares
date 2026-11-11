'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Activity, CheckCircle2, AlertTriangle, ShieldCheck, ArrowLeft, RefreshCw } from 'lucide-react';

interface HealthData {
  status: string;
  timestamp: string;
  circuitBreakers: {
    provider: string;
    state: 'CLOSED' | 'OPEN' | 'HALF_OPEN';
    failureCount: number;
    nextAttempt: string | null;
  }[];
  metricsSummary: Record<string, { total: number; success: number; error: number; avgTimeMs: number }>;
  cacheEntriesCount: number;
  environment: {
    useMockData: boolean;
    nodeEnv: string;
  };
}

export default function AdminHealthPage() {
  const [health, setHealth] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchHealth = () => {
    setLoading(true);
    fetch('/api/admin/health')
      .then((res) => res.json())
      .then(setHealth)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchHealth();
    const interval = setInterval(fetchHealth, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href="/" className="inline-flex items-center gap-2 text-xs font-semibold text-brand-600 dark:text-brand-400 mb-2 hover:underline">
            <ArrowLeft className="w-4 h-4" />
            Back to search
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
            <Activity className="w-7 h-7 text-emerald-500" />
            Scraper Health & Metrics Dashboard
          </h1>
        </div>

        <button
          onClick={fetchHealth}
          className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold flex items-center gap-2 hover:border-brand-500 transition-colors shadow-sm"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {health ? (
        <div className="space-y-6">
          {/* Status Banner */}
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between text-xs text-emerald-900 dark:text-emerald-200">
            <div className="flex items-center gap-2 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>System Status: Healthy</span>
            </div>
            <div className="font-mono text-slate-500 dark:text-slate-400">
              Cached routes: {health.cacheEntriesCount} | Mock Mode: {health.environment.useMockData ? 'Active' : 'Live'}
            </div>
          </div>

          {/* Circuit Breakers Table */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 card-shadow">
            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4">
              Provider Circuit Breakers
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {health.circuitBreakers.map((cb) => (
                <div
                  key={cb.provider}
                  className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-sm text-slate-900 dark:text-white">
                      {cb.provider}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        cb.state === 'CLOSED'
                          ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300'
                          : 'bg-red-100 dark:bg-red-900/60 text-red-800 dark:text-red-300'
                      }`}
                    >
                      {cb.state}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 space-y-1">
                    <div>Failures: {cb.failureCount} / 3</div>
                    {cb.nextAttempt && <div>Next retry: {cb.nextAttempt}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Metrics summary */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 card-shadow">
            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4">
              Carrier Scrape Performance Metrics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(health.metricsSummary).map(([code, stat]) => (
                <div
                  key={code}
                  className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40"
                >
                  <div className="font-extrabold text-sm text-slate-900 dark:text-white mb-2">
                    {code === 'PAL' ? 'Philippine Airlines' : code === 'CEB' ? 'Cebu Pacific' : 'AirAsia'} ({code})
                  </div>
                  <div className="text-xs text-slate-500 space-y-1">
                    <div>Total Queries: <strong className="text-slate-800 dark:text-slate-200">{stat.total}</strong></div>
                    <div>Success Rate: <strong className="text-slate-800 dark:text-slate-200">{stat.total > 0 ? `${Math.round((stat.success / stat.total) * 100)}%` : '100%'}</strong></div>
                    <div>Avg Response Time: <strong className="text-slate-800 dark:text-slate-200">{stat.avgTimeMs} ms</strong></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center text-sm text-slate-400">Loading system metrics...</div>
      )}
    </div>
  );
}
