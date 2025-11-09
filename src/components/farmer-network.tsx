"use client";

import { motion } from "framer-motion";
import { useState } from "react";

export default function FarmerNetwork() {
  const [selectedTab, setSelectedTab] = useState<"farmers" | "groups">(
    "farmers"
  );

  const farmers = [
    {
      id: "1",
      name: "John Doe",
      location: "Ghana",
      plantations: 15,
      rating: 4.8,
      specialty: "Organic Cocoa",
      avatar: "👨‍🌾",
    },
    {
      id: "2",
      name: "Mary Smith",
      location: "Ivory Coast",
      plantations: 22,
      rating: 4.9,
      specialty: "Fair Trade",
      avatar: "👩‍🌾",
    },
    {
      id: "3",
      name: "Ahmed Hassan",
      location: "Nigeria",
      plantations: 18,
      rating: 4.7,
      specialty: "Sustainable Farming",
      avatar: "👨‍🌾",
    },
  ];

  const groups = [
    {
      id: "1",
      name: "West Africa Cocoa Farmers",
      members: 245,
      description: "Sharing best practices",
      icon: "🌍",
    },
    {
      id: "2",
      name: "Organic Cocoa Alliance",
      members: 128,
      description: "Organic certification support",
      icon: "🌱",
    },
    {
      id: "3",
      name: "Sustainable Farming Network",
      members: 189,
      description: "Environmental practices",
      icon: "♻️",
    },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl border border-cream-200 bg-gradient-to-br from-purple-50/80 to-pink-50/80 p-6 shadow-sm backdrop-blur"
    >
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-cocoa-900">
          Farmer Network
        </h2>
        <p className="text-xs uppercase tracking-[0.25em] text-cocoa-400">
          Connect with other farmers
        </p>
      </div>

      <div className="mb-4 flex gap-2">
        <button
          type="button"
          onClick={() => setSelectedTab("farmers")}
          className={`flex-1 rounded-xl border px-4 py-2 text-sm font-semibold transition ${
            selectedTab === "farmers"
              ? "border-purple-600 bg-purple-600 text-white"
              : "border-cream-300 bg-white text-cocoa-700 hover:border-purple-300"
          }`}
        >
          Farmers
        </button>
        <button
          type="button"
          onClick={() => setSelectedTab("groups")}
          className={`flex-1 rounded-xl border px-4 py-2 text-sm font-semibold transition ${
            selectedTab === "groups"
              ? "border-purple-600 bg-purple-600 text-white"
              : "border-cream-300 bg-white text-cocoa-700 hover:border-purple-300"
          }`}
        >
          Groups
        </button>
      </div>

      <div className="space-y-3">
        {selectedTab === "farmers" ? (
          <>
            {farmers.map((farmer) => (
              <div
                key={farmer.id}
                className="flex items-center gap-3 rounded-xl border border-purple-200 bg-white/80 p-3"
              >
                <span className="text-3xl">{farmer.avatar}</span>
                <div className="flex-1">
                  <h3 className="font-semibold text-cocoa-900">
                    {farmer.name}
                  </h3>
                  <p className="text-xs text-cocoa-600">
                    {farmer.location} • {farmer.plantations} plantations
                  </p>
                  <p className="mt-1 text-xs text-cocoa-500">
                    {farmer.specialty}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-purple-700">
                    ⭐ {farmer.rating}
                  </div>
                  <button
                    type="button"
                    className="mt-1 rounded-full border border-purple-300 bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700 transition hover:bg-purple-100"
                  >
                    Connect
                  </button>
                </div>
              </div>
            ))}
          </>
        ) : (
          <>
            {groups.map((group) => (
              <div
                key={group.id}
                className="flex items-center gap-3 rounded-xl border border-pink-200 bg-white/80 p-3"
              >
                <span className="text-2xl">{group.icon}</span>
                <div className="flex-1">
                  <h3 className="font-semibold text-cocoa-900">
                    {group.name}
                  </h3>
                  <p className="text-xs text-cocoa-600">{group.description}</p>
                  <p className="mt-1 text-xs text-cocoa-500">
                    {group.members} members
                  </p>
                </div>
                <button
                  type="button"
                  className="rounded-full border border-pink-300 bg-pink-50 px-3 py-1 text-xs font-semibold text-pink-700 transition hover:bg-pink-100"
                >
                  Join
                </button>
              </div>
            ))}
          </>
        )}
      </div>
    </motion.section>
  );
}
