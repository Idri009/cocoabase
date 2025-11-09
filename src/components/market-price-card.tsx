"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import { MarketPrice, formatPrice, getPriceTrend, getMarketRecommendation } from "@/lib/market-utils";

type MarketPriceCardProps = {
  price: MarketPrice;
  historicalPrices?: MarketPrice[];
  className?: string;
  showRecommendation?: boolean;
};

export default function MarketPriceCard({
  price,
  historicalPrices = [],
  className,
  showRecommendation = true,
}: MarketPriceCardProps) {
  const trend = historicalPrices.length > 0 ? getPriceTrend([...historicalPrices, price]) : "stable";
  const recommendation = showRecommendation && historicalPrices.length > 0
    ? getMarketRecommendation(price, historicalPrices)
    : null;

  const trendColors = {
    up: "text-green-600",
    down: "text-red-600",
    stable: "text-cocoa-600",
  };

  const trendIcons = {
    up: "↗",
    down: "↘",
    stable: "→",
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "rounded-xl bg-white border border-cream-200 p-4 hover:shadow-md transition-shadow",
        className
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-lg font-semibold text-cocoa-800">{price.commodity}</h3>
          <div className="text-xs text-cocoa-500 mt-1">{price.source}</div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-cocoa-800">
            {formatPrice(price.price, price.currency)}
          </div>
          <div className="text-xs text-cocoa-500">per {price.unit}</div>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-3">
        <div className={cn("flex items-center gap-1 text-sm font-medium", trendColors[trend])}>
          <span>{trendIcons[trend]}</span>
          <span>
            {price.change >= 0 ? "+" : ""}
            {formatPrice(price.change, price.currency)}
          </span>
          <span>({price.changePercent >= 0 ? "+" : ""}{price.changePercent.toFixed(2)}%)</span>
        </div>
        <div className="text-xs text-cocoa-500">
          {new Date(price.timestamp).toLocaleDateString()}
        </div>
      </div>

      {recommendation && (
        <div className="rounded-lg bg-blue-50 border border-blue-200 p-2 mt-3">
          <div className="text-xs font-medium text-blue-800 mb-1">Market Insight</div>
          <div className="text-xs text-blue-700">{recommendation}</div>
        </div>
      )}
    </motion.div>
  );
}

