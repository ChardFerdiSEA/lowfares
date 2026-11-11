import { describe, it, expect } from 'vitest';
import { GET as searchHandler } from '../src/app/api/flights/search/route';
import { GET as flexibleHandler } from '../src/app/api/flights/flexible-dates/route';
import { GET as healthHandler } from '../src/app/api/admin/health/route';
import { NextRequest } from 'next/server';

describe('API Route Handlers', () => {
  it('searches flights via /api/flights/search', async () => {
    const req = new NextRequest('http://localhost:3000/api/flights/search?origin=MNL&destination=CEB&departDate=2026-11-20');
    const res = await searchHandler(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.flights.length).toBeGreaterThan(0);
    expect(data.providerResults.length).toBe(3);
    expect(data.cheapestFlight).toBeDefined();
  });

  it('retrieves flexible 7-day calendar via /api/flights/flexible-dates', async () => {
    const req = new NextRequest('http://localhost:3000/api/flights/flexible-dates?origin=MNL&destination=CEB&departDate=2026-11-20');
    const res = await flexibleHandler(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.days.length).toBe(7);
  });

  it('retrieves admin health status via /api/admin/health', async () => {
    const res = await healthHandler();
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.status).toBe('healthy');
    expect(data.circuitBreakers).toBeDefined();
  });
});
