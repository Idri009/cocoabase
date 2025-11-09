"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

export default function MobileFeatures() {
  const [isOnline, setIsOnline] = useState(true);
  const [gpsEnabled, setGpsEnabled] = useState(false);
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  useEffect(() => {
    setIsOnline(navigator.onLine);
    window.addEventListener("online", () => setIsOnline(true));
    window.addEventListener("offline", () => setIsOnline(false));

    return () => {
      window.removeEventListener("online", () => setIsOnline(true));
      window.removeEventListener("offline", () => setIsOnline(false));
    };
  }, []);

  const requestLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setGpsEnabled(true);
        },
        () => {
          setGpsEnabled(false);
        }
      );
    }
  };

  const features = [
    {
      id: "offline-mode",
      title: "Offline Mode",
      description: "Work without internet connection",
      status: isOnline ? "online" : "offline",
      icon: isOnline ? "📶" : "📵",
    },
    {
      id: "gps-tracking",
      title: "GPS Tracking",
      description: "Track plantation locations",
      status: gpsEnabled ? "enabled" : "disabled",
      icon: "📍",
    },
    {
      id: "photo-capture",
      title: "Photo Capture",
      description: "Capture plantation photos",
      status: "available",
      icon: "📷",
    },
    {
      id: "barcode-scan",
      title: "Barcode Scanner",
      description: "Scan inventory items",
      status: "available",
      icon: "📱",
    },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 }}
      className="rounded-3xl border border-cocoa-800/60 bg-[#101f3c]/80 p-6 text-slate-100 shadow-xl shadow-black/20 backdrop-blur"
    >
      <header className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">Mobile features</h2>
          <p className="text-sm text-slate-300/80">
            Mobile capabilities and device features.
          </p>
        </div>
      </header>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {features.map((feature) => (
          <div
            key={feature.id}
            className="rounded-2xl border border-slate-700/40 bg-slate-900/50 p-4"
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl">{feature.icon}</span>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-white">
                  {feature.title}
                </h3>
                <p className="mt-1 text-xs text-slate-300/70">
                  {feature.description}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-xs font-semibold",
                      feature.status === "online" || feature.status === "enabled"
                        ? "bg-emerald-500/20 text-emerald-300"
                        : feature.status === "offline" ||
                          feature.status === "disabled"
                        ? "bg-rose-500/20 text-rose-300"
                        : "bg-blue-500/20 text-blue-300"
                    )}
                  >
                    {feature.status}
                  </span>
                  {feature.id === "gps-tracking" && !gpsEnabled && (
                    <button
                      type="button"
                      onClick={requestLocation}
                      className="rounded-full bg-slate-800/70 px-3 py-1 text-xs font-semibold text-slate-200/90 transition hover:bg-slate-700/80"
                    >
                      Enable
                    </button>
                  )}
                </div>
                {feature.id === "gps-tracking" && location && (
                  <p className="mt-2 text-xs text-slate-400/70">
                    Lat: {location.latitude.toFixed(6)}, Lng:{" "}
                    {location.longitude.toFixed(6)}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {!isOnline && (
        <div className="mt-4 rounded-xl border border-amber-500/40 bg-amber-500/10 p-3">
          <p className="text-sm font-semibold text-amber-300">
            ⚠️ You're currently offline. Some features may be limited.
          </p>
        </div>
      )}
    </motion.section>
  );
}

