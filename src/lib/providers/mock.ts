import { FlightProvider, NormalizedFlight, SearchParams, AirlineCode } from '@/types/flight';
import { PROVIDER_CONFIGS } from './config';

interface ScheduleTemplate {
  flightNumber: string;
  depTime: string; // HH:mm
  durationMins: number;
  basePrice: number;
  fareClass: string;
  checkedBaggage: string;
  includedBaggage: boolean;
}

const AIRLINE_TEMPLATES: Record<AirlineCode, ScheduleTemplate[]> = {
  PAL: [
    { flightNumber: 'PR 2841', depTime: '06:30', durationMins: 85, basePrice: 2850, fareClass: 'Economy Saver', checkedBaggage: '20kg included', includedBaggage: true },
    { flightNumber: 'PR 2849', depTime: '11:15', durationMins: 85, basePrice: 3200, fareClass: 'Economy Flex', checkedBaggage: '20kg included', includedBaggage: true },
    { flightNumber: 'PR 2861', depTime: '16:45', durationMins: 90, basePrice: 3450, fareClass: 'Economy Saver', checkedBaggage: '20kg included', includedBaggage: true },
    { flightNumber: 'PR 2883', depTime: '20:10', durationMins: 85, basePrice: 2790, fareClass: 'Economy Supersaver', checkedBaggage: '10kg included', includedBaggage: true },
  ],
  CEB: [
    { flightNumber: '5J 565', depTime: '05:15', durationMins: 80, basePrice: 1980, fareClass: 'Go Basic', checkedBaggage: '0kg (Add-on available)', includedBaggage: false },
    { flightNumber: '5J 571', depTime: '09:40', durationMins: 85, basePrice: 2450, fareClass: 'Go Easy', checkedBaggage: '20kg included', includedBaggage: true },
    { flightNumber: '5J 583', depTime: '14:20', durationMins: 80, basePrice: 2280, fareClass: 'Go Basic', checkedBaggage: '0kg (Add-on available)', includedBaggage: false },
    { flightNumber: '5J 591', depTime: '18:50', durationMins: 85, basePrice: 2600, fareClass: 'Go Flexi', checkedBaggage: '20kg included', includedBaggage: true },
    { flightNumber: '5J 597', depTime: '22:30', durationMins: 80, basePrice: 1850, fareClass: 'Go Basic', checkedBaggage: '0kg (Add-on available)', includedBaggage: false },
  ],
  AXM: [
    { flightNumber: 'Z2 775', depTime: '07:20', durationMins: 85, basePrice: 2050, fareClass: 'Low Fare', checkedBaggage: '0kg (Add-on available)', includedBaggage: false },
    { flightNumber: 'Z2 779', depTime: '12:05', durationMins: 85, basePrice: 2190, fareClass: 'Value Pack', checkedBaggage: '20kg included', includedBaggage: true },
    { flightNumber: 'Z2 787', depTime: '17:30', durationMins: 90, basePrice: 2350, fareClass: 'Low Fare', checkedBaggage: '0kg (Add-on available)', includedBaggage: false },
    { flightNumber: 'Z2 793', depTime: '21:40', durationMins: 85, basePrice: 1890, fareClass: 'Low Fare', checkedBaggage: '0kg (Add-on available)', includedBaggage: false },
  ],
};

// Deterministic seed modifier based on date string so repeated calls for the same date return identical fares
function getSeedFromDate(dateStr: string, airlineCode: string): number {
  let hash = 0;
  const str = `${dateStr}-${airlineCode}`;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export class MockProvider implements FlightProvider {
  name: string;
  airlineCode: AirlineCode;

  constructor(airlineCode: AirlineCode) {
    this.airlineCode = airlineCode;
    this.name = PROVIDER_CONFIGS[airlineCode].name;
  }

  async search(params: SearchParams): Promise<NormalizedFlight[]> {
    // Simulate network delay between 300ms and 800ms
    const delay = 300 + Math.floor(Math.random() * 400);
    await new Promise((resolve) => setTimeout(resolve, delay));

    const templates = AIRLINE_TEMPLATES[this.airlineCode] || [];
    const seed = getSeedFromDate(params.departDate, this.airlineCode);
    const dateObj = new Date(`${params.departDate}T00:00:00`);

    // Day of week price adjustment (e.g., weekends slightly higher)
    const dayOfWeek = dateObj.getDay();
    const weekendMultiplier = (dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6) ? 1.15 : 0.95;

    const flights: NormalizedFlight[] = templates.map((tmpl, idx) => {
      const [depHour, depMin] = tmpl.depTime.split(':').map(Number);
      const departure = new Date(dateObj);
      departure.setHours(depHour, depMin, 0, 0);

      const arrival = new Date(departure.getTime() + tmpl.durationMins * 60 * 1000);

      // deterministic price variation based on seed and index
      const variationFactor = ((seed + idx * 37) % 500) - 200;
      let calculatedPrice = Math.round((tmpl.basePrice * weekendMultiplier + variationFactor) / 10) * 10;
      
      // Passenger multiplier
      const totalPassengers = params.passengers.adults + params.passengers.children;
      calculatedPrice = calculatedPrice * Math.max(1, totalPassengers);

      // Cabin class multiplier
      if (params.cabin === 'business') {
        calculatedPrice = Math.round(calculatedPrice * 2.8);
      } else if (params.cabin === 'premium_economy') {
        calculatedPrice = Math.round(calculatedPrice * 1.5);
      }

      const config = PROVIDER_CONFIGS[this.airlineCode];
      const deepLink = config.directBookingUrl(
        params.origin,
        params.destination,
        params.departDate,
        params.returnDate
      );

      return {
        id: `${this.airlineCode}-${tmpl.flightNumber.replace(/\s+/g, '')}-${params.departDate}-${idx}`,
        airline: this.name,
        airlineCode: this.airlineCode,
        flightNumber: tmpl.flightNumber,
        origin: params.origin.toUpperCase(),
        destination: params.destination.toUpperCase(),
        departureTime: departure.toISOString(),
        arrivalTime: arrival.toISOString(),
        durationMinutes: tmpl.durationMins,
        stops: 0,
        cabin: params.cabin,
        baggage: {
          carryOn: '7kg',
          checked: tmpl.checkedBaggage,
          included: tmpl.includedBaggage,
        },
        fareClass: tmpl.fareClass,
        priceTotalPHP: calculatedPrice,
        currency: 'PHP',
        deepLink,
        scrapedAt: new Date().toISOString(),
      };
    });

    return flights;
  }
}
