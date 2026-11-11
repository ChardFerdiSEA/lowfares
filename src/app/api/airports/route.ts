import { NextResponse } from 'next/server';
import { searchAirports } from '@/lib/airports';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || '';
  const limit = parseInt(searchParams.get('limit') || '10', 10);
  const airports = searchAirports(query, limit);
  return NextResponse.json({ airports });
}
