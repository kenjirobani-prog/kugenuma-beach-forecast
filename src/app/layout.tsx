import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kugenuma Beach Forecast",
  description: "7-day marine forecast for Kugenuma Beach, Fujisawa",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-800 min-h-screen">{children}</body>
    </html>
  );
}
