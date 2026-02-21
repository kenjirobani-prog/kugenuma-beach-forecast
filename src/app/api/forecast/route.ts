import { NextResponse } from "next/server";
import { fetchForecast } from "@/lib/forecast";

export async function GET() {
  try {
    const data = await fetchForecast();
    return NextResponse.json(data, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
