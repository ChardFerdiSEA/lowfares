import { NextRequest, NextResponse } from 'next/server';
import { ProviderAggregator } from '@/lib/providers/aggregator';
import { SearchParams, CabinClass } from '@/types/flight';
import { addDays, format, parseISO, subDays } from 'date-fns';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const origin = (searchParams.get('origin') || '').toUpperCase();
  const destination = (searchParams.get('destination') || '').toUpperCase();
  const centerDateStr = searchParams.get('departDate') || '';
  const adults = parseInt(searchParams.get('adults') || '1', 10);
  const cabin = (searchParams.get('cabin') || 'economy') as CabinClass;

  if (!origin || !destination || !centerDateStr) {
    return NextResponse.json(
      { error: 'origin, destination, and departDate are required.' },
      { status: 400 }
    );
  }

  const centerDate = parseISO(centerDateStr);
  const aggregator = new ProviderAggregator();

  // Generate 7 days around the selected date (-3 days to +3 days)
  const days: { date: string; dayLabel: string; lowestPricePHP: number | null; airline: string | null }[] = [];

  for (let offset = -3; offset <= 3; offset++) {
    const targetDate = addDays(centerDate, offset);
    const dateFormatted = format(targetDate, 'yyyy-MM-dd');

    const params: SearchParams = {
      origin,
      destination,
      departDate: dateFormatted,
      passengers: { adults, children: 0, infants: 0 },
      cabin,
      tripType: 'one-way',
    };

    // Fast search for lowest fare on that day
    const result = await aggregator.searchAll(params);
    const lowest = result.cheapestFlight;

    days.push({
      date: dateFormatted,
      dayLabel: format(targetDate, 'EEE, MMM d'),
      lowestPricePHP: lowest ? lowest.priceTotalPHP : null,
      airline: lowest ? lowest.airline : null,
    });
  }

  return NextResponse.json({ days, origin, destination });
}
