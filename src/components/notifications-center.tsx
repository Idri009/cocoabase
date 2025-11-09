"use client";

import { motion } from "framer-motion";
import { useState } from "react";

export default function NotificationsCenter() {
  const [selectedFilter, setSelectedFilter] = useState<"all" | "unread">(
    "all"
  );

  const notifications = [
    {
      id: "1",
      type: "task",
      title: "Task Due Soon",
      message: "Fertilize Cocoa Farm A is due in 2 days",
      timestamp: "2024-01-15T10:30:00",
      read: false,
      icon: "📋",
    },
    {
      id: "2",
      type: "harvest",
      title: "Harvest Ready",
      message: "Cocoa Farm B is ready for harvest",
      timestamp: "2024-01-14T14:20:00",
      read: false,
      icon: "🚚",
    },
    {
      id: "3",
      type: "alert",
      title: "Weather Alert",
      message: "Heavy rain expected tomorrow",
      timestamp: "2024-01-13T08:15:00",
      read: true,
      icon: "🌧️",
    },
    {
      id: "4",
      type: "system",
      title: "System Update",
      message: "New features available in the dashboard",
      timestamp: "2024-01-12T16:45:00",
      read: true,
      icon: "🔔",
    },
  ];

  const filteredNotifications =
    selectedFilter === "unread"
      ? notifications.filter((n) => !n.read)
      : notifications;

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl border border-cream-200 bg-gradient-to-br from-blue-50/80 to-indigo-50/80 p-6 shadow-sm backdrop-blur"
    >
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-cocoa-900">
              Notifications
            </h2>
            <p className="text-xs uppercase tracking-[0.25em] text-cocoa-400">
              {unreadCount} unread
            </p>
          </div>
        </div>
      </div>

      <div className="mb-4 flex gap-2">
        <button
          type="button"
          onClick={() => setSelectedFilter("all")}
          className={`rounded-xl border px-3 py-1 text-xs font-semibold transition ${
            selectedFilter === "all"
              ? "border-blue-600 bg-blue-600 text-white"
              : "border-cream-300 bg-white text-cocoa-700 hover:border-blue-300"
          }`}
        >
          All
        </button>
        <button
          type="button"
          onClick={() => setSelectedFilter("unread")}
          className={`rounded-xl border px-3 py-1 text-xs font-semibold transition ${
            selectedFilter === "unread"
              ? "border-blue-600 bg-blue-600 text-white"
              : "border-cream-300 bg-white text-cocoa-700 hover:border-blue-300"
          }`}
        >
          Unread ({unreadCount})
        </button>
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {filteredNotifications.length === 0 ? (
          <div className="rounded-xl border border-cream-200 bg-cream-50/70 p-6 text-center">
            <p className="text-sm text-cocoa-600">No notifications</p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`rounded-xl border p-3 ${
                notification.read
                  ? "border-blue-200 bg-white/60"
                  : "border-blue-300 bg-blue-50/80"
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-xl">{notification.icon}</span>
                <div className="flex-1">
                  <h3 className="font-semibold text-cocoa-900">
                    {notification.title}
                  </h3>
                  <p className="mt-1 text-sm text-cocoa-600">
                    {notification.message}
                  </p>
                  <p className="mt-1 text-xs text-cocoa-500">
                    {new Date(notification.timestamp).toLocaleDateString()}
                  </p>
                </div>
                {!notification.read && (
                  <span className="h-2 w-2 rounded-full bg-blue-500" />
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </motion.section>
  );
}
