export interface Airport {
  code: string;
  name: string;
  city: string;
  country: string;
  isPopular?: boolean;
}

export const AIRPORTS: Airport[] = [
  // Philippine Major Hubs
  { code: 'MNL', name: 'Ninoy Aquino International Airport', city: 'Manila', country: 'Philippines', isPopular: true },
  { code: 'CEB', name: 'Mactan-Cebu International Airport', city: 'Cebu', country: 'Philippines', isPopular: true },
  { code: 'CRK', name: 'Clark International Airport', city: 'Clark / Angeles', country: 'Philippines', isPopular: true },
  { code: 'DVO', name: 'Francisco Bangoy International Airport', city: 'Davao', country: 'Philippines', isPopular: true },
  { code: 'ILO', name: 'Iloilo International Airport', city: 'Iloilo', country: 'Philippines', isPopular: true },
  { code: 'KLO', name: 'Kalibo International Airport', city: 'Kalibo (Boracay)', country: 'Philippines', isPopular: true },
  { code: 'MPH', name: 'Godofredo P. Ramos Airport (Caticlan)', city: 'Boracay / Caticlan', country: 'Philippines', isPopular: true },
  { code: 'PPS', name: 'Puerto Princesa International Airport', city: 'Puerto Princesa (Palawan)', country: 'Philippines', isPopular: true },
  { code: 'TAG', name: 'Bohol-Panglao International Airport', city: 'Panglao / Tagbilaran', country: 'Philippines', isPopular: true },
  { code: 'GES', name: 'General Santos International Airport', city: 'General Santos', country: 'Philippines' },
  { code: 'BCD', name: 'Bacolod-Silay Airport', city: 'Bacolod', country: 'Philippines' },
  { code: 'CGY', name: 'Laguindingan Airport', city: 'Cagayan de Oro', country: 'Philippines' },
  { code: 'ZAM', name: 'Zamboanga International Airport', city: 'Zamboanga', country: 'Philippines' },
  { code: 'TAC', name: 'Daniel Z. Romualdez Airport', city: 'Tacloban', country: 'Philippines' },
  { code: 'USU', name: 'Francisco B. Reyes Airport (Busuanga)', city: 'Coron / Busuanga', country: 'Philippines', isPopular: true },
  { code: 'ENI', name: 'El Nido Airport (Lio)', city: 'El Nido (Palawan)', country: 'Philippines' },
  { code: 'IAO', name: 'Sayak Airport (Siargao)', city: 'Siargao', country: 'Philippines', isPopular: true },
  { code: 'LAO', name: 'Laoag International Airport', city: 'Laoag', country: 'Philippines' },
  { code: 'LEZ', name: 'Bicol International Airport', city: 'Legazpi', country: 'Philippines' },
  { code: 'CBO', name: 'Awang Airport', city: 'Cotabato', country: 'Philippines' },
  { code: 'OZC', name: 'Labo Airport', city: 'Ozamiz', country: 'Philippines' },
  { code: 'DPL', name: 'Dipolog Airport', city: 'Dipolog', country: 'Philippines' },
  { code: 'RXS', name: 'Roxas Airport', city: 'Roxas City', country: 'Philippines' },
  { code: 'TUG', name: 'Tuguegarao Airport', city: 'Tuguegarao', country: 'Philippines' },
  { code: 'SJI', name: 'San Jose Airport', city: 'San Jose (Mindoro)', country: 'Philippines' },
  { code: 'DGT', name: 'Sibulan Airport', city: 'Dumaguete', country: 'Philippines' },

  // Key International Gateways
  { code: 'SIN', name: 'Singapore Changi Airport', city: 'Singapore', country: 'Singapore', isPopular: true },
  { code: 'HKG', name: 'Hong Kong International Airport', city: 'Hong Kong', country: 'Hong Kong', isPopular: true },
  { code: 'NRT', name: 'Narita International Airport', city: 'Tokyo (Narita)', country: 'Japan', isPopular: true },
  { code: 'HND', name: 'Tokyo Haneda Airport', city: 'Tokyo (Haneda)', country: 'Japan' },
  { code: 'KIX', name: 'Kansai International Airport', city: 'Osaka', country: 'Japan', isPopular: true },
  { code: 'ICN', name: 'Incheon International Airport', city: 'Seoul', country: 'South Korea', isPopular: true },
  { code: 'BKK', name: 'Suvarnabhumi Airport', city: 'Bangkok', country: 'Thailand', isPopular: true },
  { code: 'TPE', name: 'Taiwan Taoyuan International Airport', city: 'Taipei', country: 'Taiwan', isPopular: true },
  { code: 'KUL', name: 'Kuala Lumpur International Airport', city: 'Kuala Lumpur', country: 'Malaysia' },
  { code: 'DXB', name: 'Dubai International Airport', city: 'Dubai', country: 'United Arab Emirates' },
  { code: 'SYD', name: 'Sydney Kingsford Smith Airport', city: 'Sydney', country: 'Australia' },
  { code: 'MEL', name: 'Melbourne Airport', city: 'Melbourne', country: 'Australia' },
  { code: 'SFO', name: 'San Francisco International Airport', city: 'San Francisco', country: 'United States' },
  { code: 'LAX', name: 'Los Angeles International Airport', city: 'Los Angeles', country: 'United States' },
  { code: 'YVR', name: 'Vancouver International Airport', city: 'Vancouver', country: 'Canada' },
  { code: 'LHR', name: 'Heathrow Airport', city: 'London', country: 'United Kingdom' },
];

export function searchAirports(query: string, limit = 8): Airport[] {
  if (!query || query.trim() === '') {
    return AIRPORTS.filter((a) => a.isPopular).slice(0, limit);
  }

  const clean = query.trim().toLowerCase();
  
  // Exact match on IATA code gets first priority
  const exactCode = AIRPORTS.filter((a) => a.code.toLowerCase() === clean);
  const startsWithCode = AIRPORTS.filter((a) => a.code.toLowerCase().startsWith(clean) && a.code.toLowerCase() !== clean);
  const matchedCityOrName = AIRPORTS.filter(
    (a) =>
      (a.city.toLowerCase().includes(clean) ||
        a.name.toLowerCase().includes(clean) ||
        a.country.toLowerCase().includes(clean)) &&
      !a.code.toLowerCase().startsWith(clean)
  );

  return [...exactCode, ...startsWithCode, ...matchedCityOrName].slice(0, limit);
}

export function getAirportByCode(code: string): Airport | undefined {
  if (!code) return undefined;
  return AIRPORTS.find((a) => a.code.toUpperCase() === code.toUpperCase());
}
