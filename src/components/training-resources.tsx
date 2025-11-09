"use client";

import { motion } from "framer-motion";
import { useState } from "react";

export default function TrainingResources() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const resources = [
    {
      id: "1",
      title: "Cocoa Planting Basics",
      category: "planting",
      type: "video",
      duration: "15 min",
      icon: "🌱",
    },
    {
      id: "2",
      title: "Pest Management Guide",
      category: "pests",
      type: "guide",
      duration: "10 min read",
      icon: "🐛",
    },
    {
      id: "3",
      title: "Harvest Best Practices",
      category: "harvest",
      type: "video",
      duration: "20 min",
      icon: "🚚",
    },
    {
      id: "4",
      title: "Soil Health Management",
      category: "soil",
      type: "guide",
      duration: "12 min read",
      icon: "🌍",
    },
    {
      id: "5",
      title: "Watering Techniques",
      category: "irrigation",
      type: "video",
      duration: "8 min",
      icon: "💧",
    },
    {
      id: "6",
      title: "Organic Certification",
      category: "certification",
      type: "guide",
      duration: "25 min read",
      icon: "✅",
    },
  ];

  const categories = [
    { id: "all", label: "All Resources" },
    { id: "planting", label: "Planting" },
    { id: "pests", label: "Pest Management" },
    { id: "harvest", label: "Harvest" },
    { id: "soil", label: "Soil Health" },
    { id: "irrigation", label: "Irrigation" },
    { id: "certification", label: "Certification" },
  ];

  const filteredResources =
    selectedCategory === "all"
      ? resources
      : resources.filter((r) => r.category === selectedCategory);

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl border border-cream-200 bg-gradient-to-br from-green-50/80 to-emerald-50/80 p-6 shadow-sm backdrop-blur"
    >
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-cocoa-900">
          Training Resources
        </h2>
        <p className="text-xs uppercase tracking-[0.25em] text-cocoa-400">
          Educational content and guides
        </p>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category.id}
            type="button"
            onClick={() => setSelectedCategory(category.id)}
            className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
              selectedCategory === category.id
                ? "border-green-600 bg-green-600 text-white"
                : "border-cream-300 bg-white text-cocoa-700 hover:border-green-300"
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {filteredResources.map((resource) => (
          <div
            key={resource.id}
            className="flex items-start gap-3 rounded-2xl border border-green-200 bg-white/90 p-4 shadow-sm"
          >
            <span className="text-2xl">{resource.icon}</span>
            <div className="flex-1">
              <h3 className="font-semibold text-cocoa-900">
                {resource.title}
              </h3>
              <div className="mt-2 flex items-center gap-2 text-xs text-cocoa-500">
                <span className="rounded-full bg-green-100 px-2 py-0.5">
                  {resource.type}
                </span>
                <span>{resource.duration}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredResources.length === 0 && (
        <div className="rounded-2xl border border-cream-200 bg-cream-50/70 p-6 text-center">
          <p className="text-sm text-cocoa-600">
            No resources found in this category
          </p>
        </div>
      )}
    </motion.section>
  );
}
