export type AirlineCode = 'PAL' | 'CEB' | 'AXM';

export interface PassengerCount {
  adults: number;
  children: number;
  infants: number;
}

export type CabinClass = 'economy' | 'premium_economy' | 'business';

export interface SearchParams {
  origin: string; // e.g. "MNL"
  destination: string; // e.g. "CEB"
  departDate: string; // "YYYY-MM-DD"
  returnDate?: string; // "YYYY-MM-DD"
  passengers: PassengerCount;
  cabin: CabinClass;
  tripType: 'one-way' | 'round-trip';
}

export interface BaggageAllowance {
  carryOn: string; // e.g. "7kg"
  checked: string; // e.g. "20kg" or "0kg (Available for add-on)"
  included: boolean;
}

export interface FlightSegment {
  airline: string;
  airlineCode: AirlineCode;
  flightNumber: string;
  origin: string;
  destination: string;
  departureTime: string; // ISO string
  arrivalTime: string; // ISO string
  durationMinutes: number;
  aircraft?: string;
}

export interface NormalizedFlight {
  id: string;
  airline: string; // Philippine Airlines, Cebu Pacific, AirAsia
  airlineCode: AirlineCode;
  flightNumber: string; // e.g. "PR 2841", "5J 565", "Z2 775"
  origin: string;
  destination: string;
  departureTime: string; // ISO string
  arrivalTime: string; // ISO string
  durationMinutes: number;
  stops: number; // 0 for nonstop, 1+ for layovers
  segments?: FlightSegment[];
  cabin: CabinClass;
  baggage: BaggageAllowance;
  fareClass: string; // e.g. "Economy Super Saver", "Go Basic", "Low Fare"
  priceTotalPHP: number; // all-in PHP price (taxes & fees included)
  currency: 'PHP';
  deepLink: string;
  scrapedAt: string; // ISO string
  isLowestPrice?: boolean;
  isFastest?: boolean;
}

export interface ProviderSearchResult {
  provider: string;
  airlineCode: AirlineCode;
  flights: NormalizedFlight[];
  error?: string;
  durationMs: number;
  timestamp: string;
}

export interface FlightProvider {
  name: string;
  airlineCode: AirlineCode;
  search(params: SearchParams): Promise<NormalizedFlight[]>;
}

export interface BookingProvider {
  id: string;
  name: string;
  type: 'direct_deeplink' | 'licensed_ndc_api';
  getBookingUrl(flight: NormalizedFlight, params: SearchParams): string;
  createOrder?(flight: NormalizedFlight, passengers: unknown): Promise<{ orderId: string; paymentUrl: string }>;
}
