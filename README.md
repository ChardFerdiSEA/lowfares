# LowFares (lowfares.com) ✈️🇵🇭

**LowFares** is a modern, minimalist flight fare comparison web platform focused on Philippine carriers: **Philippine Airlines (PAL)**, **Cebu Pacific**, and **AirAsia Philippines**.

Users search a route and travel dates, see normalized lowest fares from all three carriers side by side, inspect 7-day flexible calendar fares, filter by stops and baggage, and proceed to book with prefilled criteria.

---

## 🏗️ Architecture & Tech Stack

- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS (modern minimalist palette, dark mode support).
- **Backend**: Next.js API Routes (`/api/flights/search`, `/api/flights/flexible-dates`, `/api/admin/health`, `/api/airports`).
  - *Backend Justification*: Next.js 14 API routes with Node.js 22 runtime provide unified TypeScript types between frontend and scraper clients, zero-latency streaming (SSE), seamless Vercel deployment, and simplified local Docker composition without orchestrating multiple language environments.
- **Scraping Layer**: Provider architecture with `FlightProvider` interface, isolated provider configuration (`src/lib/providers/config.ts`), per-provider circuit breakers, retries, rotating user agents, and fallback handling.
- **Mock Provider**: `MockProvider` generates realistic Philippine domestic and regional carrier schedules and pricing when mock mode is enabled (`USE_MOCK_DATA=true`).
- **Cache**: Fast key-value Redis store (Upstash-compatible) with 10–15 minute TTL on search results.
- **Database**: PostgreSQL (Prisma ORM) configured with SQLite local development fallback for search logs, price alerts, and scrape metrics.
- **Testing**: Vitest for unit & route tests, Playwright for e2e & visual regression verification.
- **Containerization**: Multi-stage `Dockerfile` + `docker-compose.yml` for local development.

---

## 🚀 Quickstart & Setup

### 1. Prerequisites
- Node.js 20+ or 22+
- npm, yarn, or pnpm

### 2. Installation
```bash
# Clone the repository
git clone <repo-url>
cd lowfares

# Install dependencies
npm install

# Generate Prisma Client & Database
npx prisma generate
npx prisma db push
```

### 3. Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Key variables:
- `USE_MOCK_DATA="true"`: Enables `MockProvider` for testing and demonstration. Set to `"false"` to engage live network scraping.
- `DATABASE_URL`: `file:./dev.db` (local dev) or `postgresql://user:pass@host:5432/lowfares` (production).
- `CACHE_TTL_SECONDS`: `900` (15 minutes).
- `SCRAPER_TIMEOUT_MS`: `20000` (20-second per-provider timeout).

### 4. Running the Development Server
```bash
npm run build && npm run start
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Running with Docker Compose
```bash
docker-compose up --build
```

---

## 🧪 Testing

```bash
# Run unit tests (provider aggregator, airport search, filtering, API routes)
npm test
```

---

## 🛠️ Scraper Maintenance & Fixing Airlines

All airline endpoints, headers, and DOM fallback selectors are isolated in a single configuration file:
👉 `src/lib/providers/config.ts`

### 1. Philippine Airlines (PAL)
- **Direct Link**: `https://www.philippineairlines.com/en/booking?origin={origin}&destination={dest}&departureDate={date}&tripType={O|R}`
- **Selectors Config**:
  - Fare container: `[data-testid="flight-card"], .flight-card-container`
  - Flight number: `.flight-number, [data-testid="flight-number"]`
  - Total price: `.total-fare, .price-display, [data-testid="price-amount"]`
- **When PAL updates layout**: Inspect PAL's flight booking results in DevTools Network tab. Check `searchEndpoint` payload or update the CSS selector strings in `PROVIDER_CONFIGS.PAL.selectors`.

### 2. Cebu Pacific (CEB)
- **Direct Link**: `https://www.cebupacificair.com/en-PH/booking?origin={origin}&destination={dest}&departureDate={date}`
- **Endpoint**: Cebu Pacific uses a Navitaire/Newskies API backend. If endpoint headers or auth tokens rotate, update `PROVIDER_CONFIGS.CEB.headers` or adjust the payload mapping in the provider adapter.

### 3. AirAsia (AA / AXM)
- **Direct Link**: `https://www.airasia.com/flights/search/?origin={origin}&destination={dest}&departDate={date}`
- **Endpoint**: AirAsia uses JSON availability endpoints (e.g. `https://vls-flights.airasia.com/v2/flights/search`). If signature headers rotate, update `PROVIDER_CONFIGS.AXM`.

---

## ⚖️ Legal & Trust Disclaimers
LowFares is an independent comparison site and is not affiliated with Philippine Airlines, Cebu Pacific, or AirAsia. Prices are indicative and may change at booking. Bookings are completed directly on the official airline website.
