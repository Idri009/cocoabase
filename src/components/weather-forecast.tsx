"use client";

import { motion } from "framer-motion";
import { usePlantationsStore } from "@/store/plantations";

export default function WeatherForecast() {
  const plantations = usePlantationsStore((state) => state.plantations);

  const forecast = [
    {
      date: new Date(Date.now() + 0 * 24 * 60 * 60 * 1000),
      condition: "sunny",
      high: 28,
      low: 22,
      rainfall: 0,
      humidity: 65,
    },
    {
      date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      condition: "cloudy",
      high: 26,
      low: 21,
      rainfall: 5,
      humidity: 70,
    },
    {
      date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      condition: "rainy",
      high: 24,
      low: 20,
      rainfall: 15,
      humidity: 85,
    },
    {
      date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      condition: "sunny",
      high: 27,
      low: 21,
      rainfall: 0,
      humidity: 68,
    },
    {
      date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
      condition: "cloudy",
      high: 25,
      low: 20,
      rainfall: 8,
      humidity: 72,
    },
  ];

  const getConditionEmoji = (condition: string) => {
    const emojiMap: Record<string, string> = {
      sunny: "☀️",
      cloudy: "☁️",
      rainy: "🌧️",
      stormy: "⛈️",
      windy: "💨",
      foggy: "🌫️",
      snowy: "❄️",
    };
    return emojiMap[condition] || "☀️";
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl border border-cream-200 bg-gradient-to-br from-blue-50/80 to-cyan-50/80 p-6 shadow-sm backdrop-blur"
    >
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-cocoa-900">
          Weather Forecast
        </h2>
        <p className="text-xs uppercase tracking-[0.25em] text-cocoa-400">
          5-day forecast
        </p>
      </div>

      <div className="space-y-2">
        {forecast.map((day, index) => (
          <div
            key={index}
            className="flex items-center justify-between rounded-xl border border-blue-200 bg-white/80 p-3"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{getConditionEmoji(day.condition)}</span>
              <div>
                <p className="text-sm font-semibold text-cocoa-900">
                  {day.date.toLocaleDateString("en-US", {
                    weekday: index === 0 ? "long" : "short",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
                <p className="text-xs text-cocoa-600 capitalize">
                  {day.condition}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-right">
              <div>
                <p className="text-sm font-bold text-cocoa-900">
                  {day.high}°C
                </p>
                <p className="text-xs text-cocoa-600">{day.low}°C</p>
              </div>
              {day.rainfall > 0 && (
                <div>
                  <p className="text-xs text-blue-600">💧 {day.rainfall}mm</p>
                  <p className="text-xs text-cocoa-600">{day.humidity}%</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </motion.section>
  );
}
