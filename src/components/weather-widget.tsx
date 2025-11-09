"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import {
  WeatherData,
  getWeatherIcon,
  formatWeatherCondition,
  getWeatherImpact,
  calculateWeatherScore,
  getWeatherRecommendations,
} from "@/lib/weather-utils";

type WeatherWidgetProps = {
  weather: WeatherData;
  className?: string;
  compact?: boolean;
};

export default function WeatherWidget({
  weather,
  className,
  compact = false,
}: WeatherWidgetProps) {
  const impact = getWeatherImpact(weather);
  const score = calculateWeatherScore(weather);
  const recommendations = getWeatherRecommendations(weather);

  if (compact) {
    return (
      <div className={cn("rounded-xl bg-white border border-cream-200 p-4", className)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{getWeatherIcon(weather.condition)}</span>
            <div>
              <div className="text-lg font-semibold text-cocoa-800">
                {weather.temperature}°C
              </div>
              <div className="text-sm text-cocoa-600">
                {formatWeatherCondition(weather.condition)}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-cocoa-500">Score</div>
            <div className="text-lg font-semibold text-cocoa-800">{score}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("rounded-xl bg-white border border-cream-200 p-6", className)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <span className="text-5xl">{getWeatherIcon(weather.condition)}</span>
          <div>
            <div className="text-3xl font-bold text-cocoa-800">
              {weather.temperature}°C
            </div>
            <div className="text-lg text-cocoa-600">
              {formatWeatherCondition(weather.condition)}
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-cocoa-500 mb-1">Weather Score</div>
          <div className="text-2xl font-bold text-cocoa-800">{score}/100</div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className="text-xs text-cocoa-500 mb-1">Humidity</div>
          <div className="text-lg font-semibold text-cocoa-800">
            {weather.humidity}%
          </div>
        </div>
        <div className="text-center">
          <div className="text-xs text-cocoa-500 mb-1">Precipitation</div>
          <div className="text-lg font-semibold text-cocoa-800">
            {weather.precipitation}mm
          </div>
        </div>
        <div className="text-center">
          <div className="text-xs text-cocoa-500 mb-1">Wind Speed</div>
          <div className="text-lg font-semibold text-cocoa-800">
            {weather.windSpeed} km/h
          </div>
        </div>
      </div>

      <div
        className={cn(
          "rounded-lg p-3 mb-4",
          impact.impact === "positive"
            ? "bg-green-50 border border-green-200"
            : impact.impact === "negative"
            ? "bg-red-50 border border-red-200"
            : "bg-blue-50 border border-blue-200"
        )}
      >
        <div className="text-sm font-medium text-cocoa-800 mb-1">
          {impact.impact === "positive" ? "✓" : impact.impact === "negative" ? "⚠" : "ℹ"}{" "}
          Impact Assessment
        </div>
        <div className="text-xs text-cocoa-600">{impact.message}</div>
      </div>

      {weather.alerts.length > 0 && (
        <div className="mb-4">
          <div className="text-sm font-semibold text-cocoa-800 mb-2">Weather Alerts</div>
          <div className="space-y-2">
            {weather.alerts.map((alert, index) => (
              <div
                key={index}
                className="rounded-lg bg-yellow-50 border border-yellow-200 p-2 text-xs text-yellow-800"
              >
                <div className="font-medium">{alert.type.toUpperCase()}</div>
                <div>{alert.message}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {recommendations.length > 0 && (
        <div>
          <div className="text-sm font-semibold text-cocoa-800 mb-2">Recommendations</div>
          <ul className="space-y-1">
            {recommendations.map((rec, index) => (
              <li key={index} className="text-xs text-cocoa-600 flex items-start gap-2">
                <span>•</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  );
}
