import { AirlineCode } from '@/types/flight';

export interface ProviderConfig {
  airlineCode: AirlineCode;
  name: string;
  domain: string;
  searchEndpoint?: string;
  directBookingUrl: (origin: string, dest: string, departDate: string, returnDate?: string) => string;
  selectors?: {
    fareCard?: string;
    flightNumber?: string;
    departureTime?: string;
    arrivalTime?: string;
    price?: string;
  };
  headers?: Record<string, string>;
  userAgentRotation: string[];
}

export const PROVIDER_CONFIGS: Record<AirlineCode, ProviderConfig> = {
  PAL: {
    airlineCode: 'PAL',
    name: 'Philippine Airlines',
    domain: 'https://www.philippineairlines.com',
    directBookingUrl: (origin, dest, departDate, returnDate) => {
      const trip = returnDate ? 'R' : 'O';
      return `https://www.philippineairlines.com/en/booking?origin=${origin}&destination=${dest}&departureDate=${departDate}${returnDate ? `&returnDate=${returnDate}` : ''}&tripType=${trip}`;
    },
    selectors: {
      fareCard: '[data-testid="flight-card"], .flight-card-container, .fare-option',
      flightNumber: '.flight-number, [data-testid="flight-number"]',
      departureTime: '.dep-time, [data-testid="departure-time"]',
      arrivalTime: '.arr-time, [data-testid="arrival-time"]',
      price: '.total-fare, .price-display, [data-testid="price-amount"]',
    },
    userAgentRotation: [
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
    ],
  },
  CEB: {
    airlineCode: 'CEB',
    name: 'Cebu Pacific',
    domain: 'https://www.cebupacificair.com',
    searchEndpoint: 'https://api.cebupacificair.com/availability/v2',
    directBookingUrl: (origin, dest, departDate, returnDate) => {
      return `https://www.cebupacificair.com/en-PH/booking?origin=${origin}&destination=${dest}&departureDate=${departDate}${returnDate ? `&returnDate=${returnDate}` : ''}`;
    },
    selectors: {
      fareCard: '.flight-bound-row, .fare-bundle-card',
      flightNumber: '.flight-number, .carrier-code',
      departureTime: '.departure-time',
      arrivalTime: '.arrival-time',
      price: '.flight-price-amount',
    },
    userAgentRotation: [
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
    ],
  },
  AXM: {
    airlineCode: 'AXM',
    name: 'AirAsia',
    domain: 'https://www.airasia.com',
    searchEndpoint: 'https://vls-flights.airasia.com/v2/flights/search',
    directBookingUrl: (origin, dest, departDate, returnDate) => {
      return `https://www.airasia.com/flights/search/?origin=${origin}&destination=${dest}&departDate=${departDate}${returnDate ? `&returnDate=${returnDate}` : ''}`;
    },
    selectors: {
      fareCard: '.flight-card, [data-testid="flight-card"]',
      flightNumber: '.flight-number',
      departureTime: '.departure-time',
      arrivalTime: '.arrival-time',
      price: '.fare-amount, .flight-price',
    },
    userAgentRotation: [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
    ],
  },
};
