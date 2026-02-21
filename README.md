# Kugenuma Beach Forecast

A minimal Next.js (App Router) web application showing a 7-day marine forecast for Kugenuma Beach, Fujisawa, Kanagawa, Japan.

**Location:** 35.3089°N, 139.4909°E — timezone: Asia/Tokyo
**Data source:** [Open-Meteo Marine API](https://open-meteo.com/) (fetched fresh on every request, no caching)

## Features

- 7-day marine forecast grouped by date
- Times shown: 05:00, 08:00, 11:00, 14:00, 17:00 JST
- Displays: wave height (m), wave period (s), wave direction (°), wind speed (m/s), wind direction (°)
- Server-side Route Handler at `/api/forecast`
- Friendly error UI with retry button

## Prerequisites

- [Node.js](https://nodejs.org/) 18.18 or later
- npm (comes with Node.js)

## Running locally

```bash
# 1. Clone the repository
git clone https://github.com/kenjirobani-prog/kugenuma-beach-forecast.git
cd kugenuma-beach-forecast

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Building for production

```bash
npm run build
npm start
```

## Project structure

```
src/
└── app/
    ├── layout.tsx          # Root layout
    ├── page.tsx            # Main forecast page (client component)
    ├── globals.css         # Tailwind base styles
    └── api/
        └── forecast/
            └── route.ts    # Route Handler — fetches Open-Meteo marine data
```

## API

### `GET /api/forecast`

Returns a JSON object with the 7-day forecast, filtered to the five target hours per day.

```json
{
  "days": [
    {
      "date": "2025-01-01",
      "entries": [
        {
          "time": "05:00",
          "waveHeight": 1.2,
          "wavePeriod": 8,
          "waveDirection": 135,
          "windSpeed": 3.5,
          "windDirection": 220
        }
      ]
    }
  ],
  "fetchedAt": "2025-01-01T00:00:00.000Z"
}
```

All times in the response are in Asia/Tokyo (JST, UTC+9).
