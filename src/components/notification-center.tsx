"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/cn";
import Badge from "./badge";

export type Notification = {
  id: string;
  type: "info" | "success" | "warning" | "error";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
};

type NotificationCenterProps = {
  notifications: Notification[];
  onMarkAsRead?: (id: string) => void;
  onMarkAllAsRead?: () => void;
  onDelete?: (id: string) => void;
  className?: string;
};

export default function NotificationCenter({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete,
  className,
}: NotificationCenterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const typeColors = {
    info: "bg-blue-100 text-blue-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    error: "bg-red-100 text-red-800",
  };

  return (
    <div className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-cocoa-100 transition-colors"
      >
        <span className="text-xl">🔔</span>
        {unreadCount > 0 && (
          <Badge
            variant="error"
            className="absolute -top-1 -right-1 min-w-[20px] h-5 flex items-center justify-center text-xs"
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </Badge>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-2 w-96 bg-white rounded-xl border border-cream-200 shadow-lg z-50 max-h-[600px] overflow-hidden flex flex-col"
          >
            <div className="p-4 border-b border-cream-200 flex items-center justify-between">
              <h3 className="font-semibold text-cocoa-800">Notifications</h3>
              {unreadCount > 0 && onMarkAllAsRead && (
                <button
                  type="button"
                  onClick={onMarkAllAsRead}
                  className="text-xs text-cocoa-600 hover:text-cocoa-800"
                >
                  Mark all as read
                </button>
              )}
            </div>

            <div className="overflow-y-auto flex-1">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-cocoa-500">
                  <div className="text-4xl mb-2">📭</div>
                  <div>No notifications</div>
                </div>
              ) : (
                <div className="divide-y divide-cream-200">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={cn(
                        "p-4 hover:bg-cocoa-50 transition-colors cursor-pointer",
                        !notification.read && "bg-blue-50/50"
                      )}
                      onClick={() => {
                        if (!notification.read && onMarkAsRead) {
                          onMarkAsRead(notification.id);
                        }
                        if (notification.actionUrl) {
                          window.location.href = notification.actionUrl;
                        }
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={cn(
                            "w-2 h-2 rounded-full mt-2 flex-shrink-0",
                            !notification.read && typeColors[notification.type]
                          )}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h4 className="font-medium text-cocoa-800 text-sm">
                              {notification.title}
                            </h4>
                            {onDelete && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onDelete(notification.id);
                                }}
                                className="text-cocoa-400 hover:text-cocoa-600 text-xs"
                              >
                                ✕
                              </button>
                            )}
                          </div>
                          <p className="text-xs text-cocoa-600 mb-2">
                            {notification.message}
                          </p>
                          <div className="text-xs text-cocoa-400">
                            {new Date(notification.timestamp).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

