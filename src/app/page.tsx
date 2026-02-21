import { fetchForecast, type DayForecast, type ForecastEntry } from "@/lib/forecast";

function fmt(value: number | null | undefined, decimals = 1): string {
  if (value === null || value === undefined) return "—";
  return value.toFixed(decimals);
}

function bearingToCompass(deg: number | null | undefined): string {
  if (deg === null || deg === undefined) return "";
  const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  return dirs[Math.round(deg / 45) % 8];
}

function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
}

function EntryRow({ entry }: { entry: ForecastEntry }) {
  return (
    <tr className="border-b border-slate-100 hover:bg-blue-50/40 transition-colors">
      <td className="px-3 py-2.5 font-mono font-medium text-slate-600 whitespace-nowrap">
        {entry.time}
      </td>
      <td className="px-3 py-2.5 text-center">
        <span className="font-semibold text-blue-700">{fmt(entry.waveHeight)}</span>
        <span className="text-xs text-slate-400 ml-0.5">m</span>
      </td>
      <td className="px-3 py-2.5 text-center">
        <span>{fmt(entry.wavePeriod, 0)}</span>
        <span className="text-xs text-slate-400 ml-0.5">s</span>
      </td>
      <td className="px-3 py-2.5 text-center">
        {entry.waveDirection != null ? (
          <>
            <span>{fmt(entry.waveDirection, 0)}°</span>
            <span className="text-xs text-slate-500 ml-1">
              {bearingToCompass(entry.waveDirection)}
            </span>
          </>
        ) : (
          "—"
        )}
      </td>
      <td className="px-3 py-2.5 text-center">
        <span>{fmt(entry.windSpeed)}</span>
        <span className="text-xs text-slate-400 ml-0.5">m/s</span>
      </td>
      <td className="px-3 py-2.5 text-center">
        {entry.windDirection != null ? (
          <>
            <span>{fmt(entry.windDirection, 0)}°</span>
            <span className="text-xs text-slate-500 ml-1">
              {bearingToCompass(entry.windDirection)}
            </span>
          </>
        ) : (
          "—"
        )}
      </td>
    </tr>
  );
}

function DayCard({ day }: { day: DayForecast }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-2.5">
        <h2 className="text-white font-semibold">{formatDate(day.date)}</h2>
        <p className="text-blue-200 text-xs">{day.date}</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide border-b border-slate-200">
              <th className="px-3 py-2 text-left">Time (JST)</th>
              <th className="px-3 py-2 text-center">Wave Ht</th>
              <th className="px-3 py-2 text-center">Period</th>
              <th className="px-3 py-2 text-center">Wave Dir</th>
              <th className="px-3 py-2 text-center">Wind Spd</th>
              <th className="px-3 py-2 text-center">Wind Dir</th>
            </tr>
          </thead>
          <tbody>
            {day.entries.map((entry) => (
              <EntryRow key={entry.time} entry={entry} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default async function Home() {
  let fetchedAt: string | null = null;
  let days: DayForecast[] = [];
  let error: string | null = null;

  try {
    const data = await fetchForecast();
    days = data.days;
    fetchedAt = data.fetchedAt;
  } catch (err) {
    error = err instanceof Error ? err.message : "Failed to load forecast";
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-1">Kugenuma Beach Forecast</h1>
        <p className="text-slate-500 text-sm">
          Fujisawa, Kanagawa, Japan &mdash; 35.3089°N 139.4909°E
        </p>
        {fetchedAt && (
          <p className="text-slate-400 text-xs mt-1">
            Fetched:{" "}
            {new Date(fetchedAt).toLocaleString("ja-JP", {
              timeZone: "Asia/Tokyo",
              dateStyle: "short",
              timeStyle: "medium",
            })}{" "}
            JST
          </p>
        )}
      </div>

      {/* Error state */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
          <div className="text-red-400 text-5xl mb-4">⚠</div>
          <h2 className="text-red-700 font-semibold text-lg mb-2">Could not load forecast</h2>
          <p className="text-red-600 text-sm mb-4">{error}</p>
          <p className="text-red-400 text-xs">
            Data is fetched from{" "}
            <span className="font-mono">marine-api.open-meteo.com</span>. Please try again later.
          </p>
        </div>
      )}

      {/* Forecast days */}
      {days.length > 0 && (
        <div className="space-y-6">
          {days.map((day) => (
            <DayCard key={day.date} day={day} />
          ))}
        </div>
      )}

      {/* Footer */}
      <footer className="mt-12 text-center text-xs text-slate-400">
        Marine data from{" "}
        <a
          href="https://open-meteo.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-slate-600"
        >
          Open-Meteo
        </a>{" "}
        &mdash; All times in Japan Standard Time (JST, UTC+9)
      </footer>
    </main>
  );
}
