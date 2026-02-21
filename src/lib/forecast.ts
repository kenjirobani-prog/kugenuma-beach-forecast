const LAT = 35.3089;
const LON = 139.4909;
const TIMEZONE = "Asia/Tokyo";
const SHOW_HOURS = new Set(["05:00", "08:00", "11:00", "14:00", "17:00"]);

export interface ForecastEntry {
  time: string; // "HH:MM"
  waveHeight: number | null;
  wavePeriod: number | null;
  waveDirection: number | null;
  windSpeed: number | null;
  windDirection: number | null;
}

export interface DayForecast {
  date: string; // "YYYY-MM-DD"
  entries: ForecastEntry[];
}

export interface ForecastData {
  days: DayForecast[];
  fetchedAt: string;
}

interface OpenMeteoResponse {
  hourly: {
    time: string[];
    wave_height: (number | null)[];
    wave_period: (number | null)[];
    wave_direction: (number | null)[];
    wind_speed_10m: (number | null)[];
    wind_direction_10m: (number | null)[];
  };
}

export async function fetchForecast(): Promise<ForecastData> {
  const url = new URL("https://marine-api.open-meteo.com/v1/marine");
  url.searchParams.set("latitude", String(LAT));
  url.searchParams.set("longitude", String(LON));
  url.searchParams.set(
    "hourly",
    "wave_height,wave_period,wave_direction,wind_speed_10m,wind_direction_10m"
  );
  url.searchParams.set("timezone", TIMEZONE);
  url.searchParams.set("forecast_days", "7");

  const res = await fetch(url.toString(), { cache: "no-store" });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Open-Meteo returned ${res.status}: ${text}`);
  }

  const raw = (await res.json()) as OpenMeteoResponse;
  const { time, wave_height, wave_period, wave_direction, wind_speed_10m, wind_direction_10m } =
    raw.hourly;

  const dayMap = new Map<string, ForecastEntry[]>();

  for (let i = 0; i < time.length; i++) {
    // time format from Open-Meteo: "YYYY-MM-DDTHH:MM"
    const [datePart, timePart] = time[i].split("T");
    if (!SHOW_HOURS.has(timePart)) continue;

    const entry: ForecastEntry = {
      time: timePart,
      waveHeight: wave_height[i],
      wavePeriod: wave_period[i],
      waveDirection: wave_direction[i],
      windSpeed: wind_speed_10m[i],
      windDirection: wind_direction_10m[i],
    };

    if (!dayMap.has(datePart)) dayMap.set(datePart, []);
    dayMap.get(datePart)!.push(entry);
  }

  const days: DayForecast[] = Array.from(dayMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, entries]) => ({
      date,
      entries: entries.sort((a, b) => a.time.localeCompare(b.time)),
    }));

  return { days, fetchedAt: new Date().toISOString() };
}
