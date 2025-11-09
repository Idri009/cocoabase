"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

export default function WeatherHistory() {
  const weatherData = useMemo(() => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return months.map((month, index) => ({
      month,
      temperature: 25 + Math.sin((index / 12) * Math.PI * 2) * 5,
      rainfall: 50 + Math.random() * 100,
      humidity: 60 + Math.random() * 20,
    }));
  }, []);

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl border border-cream-200 bg-gradient-to-br from-sky-50/80 to-blue-50/80 p-6 shadow-sm backdrop-blur"
    >
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-cocoa-900">
          Weather History
        </h2>
        <p className="text-xs uppercase tracking-[0.25em] text-cocoa-400">
          12-month weather trends
        </p>
      </div>

      <div className="space-y-3">
        {weatherData.map((data, index) => (
          <div
            key={index}
            className="flex items-center gap-4 rounded-xl border border-sky-200 bg-white/80 p-3"
          >
            <div className="w-12 text-center">
              <div className="text-xs font-semibold text-cocoa-700">
                {data.month}
              </div>
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2 text-xs">
                <span className="text-cocoa-600">🌡️</span>
                <span className="font-semibold text-cocoa-900">
                  {data.temperature.toFixed(1)}°C
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-cocoa-600">🌧️</span>
                <span className="text-cocoa-700">
                  {data.rainfall.toFixed(0)}mm
                </span>
              </div>
            </div>
            <div className="text-xs text-cocoa-500">
              💧 {data.humidity.toFixed(0)}%
            </div>
          </div>
        ))}
      </div>
    </motion.section>
  );
}
