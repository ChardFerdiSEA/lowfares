import { describe, it, expect } from 'vitest';
import { searchAirports, getAirportByCode } from '../src/lib/airports';

describe('Airport Database and Search', () => {
  it('returns Manila for MNL exact lookup', () => {
    const airport = getAirportByCode('MNL');
    expect(airport).toBeDefined();
    expect(airport?.city).toBe('Manila');
    expect(airport?.country).toBe('Philippines');
  });

  it('matches airports by partial city query', () => {
    const results = searchAirports('Cebu');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].code).toBe('CEB');
  });

  it('returns popular airports on empty query', () => {
    const results = searchAirports('');
    expect(results.length).toBeGreaterThan(0);
    expect(results.some((a) => a.code === 'MNL')).toBe(true);
  });
});
