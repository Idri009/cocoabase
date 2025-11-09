"use client";

import { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import {
  usePhotoStore,
  type PlantationPhoto,
  type PhotoCategory,
} from "@/store/photos";
import { usePlantationsStore } from "@/store/plantations";

export default function PhotoGallery() {
  const photos = usePhotoStore((state) => state.photos);
  const addPhoto = usePhotoStore((state) => state.addPhoto);
  const removePhoto = usePhotoStore((state) => state.removePhoto);
  const plantations = usePlantationsStore((state) => state.plantations);

  const [isAdding, setIsAdding] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<PhotoCategory | "all">("all");
  const [form, setForm] = useState<Partial<PlantationPhoto>>({
    category: "plantation",
    takenDate: new Date().toISOString().split("T")[0],
    tags: [],
  });

  const filteredPhotos =
    selectedCategory === "all"
      ? photos
      : photos.filter((p) => p.category === selectedCategory);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.url) {
      return;
    }
    addPhoto({
      url: form.url,
      thumbnailUrl: form.thumbnailUrl,
      category: form.category ?? "plantation",
      plantationId: form.plantationId,
      taskId: form.taskId,
      title: form.title,
      description: form.description,
      tags: form.tags || [],
      takenDate: form.takenDate || new Date().toISOString().split("T")[0],
      fileSize: form.fileSize,
    });
    setForm({
      category: "plantation",
      takenDate: new Date().toISOString().split("T")[0],
      tags: [],
    });
    setIsAdding(false);
  };

  const categories: PhotoCategory[] = [
    "plantation",
    "harvest",
    "equipment",
    "soil",
    "pest_disease",
    "other",
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
          <h2 className="text-lg font-semibold text-white">Photo gallery</h2>
          <p className="text-sm text-slate-300/80">
            Store and organize plantation photos and images.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsAdding(!isAdding)}
          className="rounded-full bg-leaf-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow-lg transition hover:bg-leaf-400"
        >
          {isAdding ? "Cancel" : "+ Add photo"}
        </button>
      </header>

      <div className="mt-4 flex flex-wrap gap-2">
        {(["all", ...categories] as const).map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-semibold transition",
              selectedCategory === cat
                ? "bg-leaf-500/20 text-leaf-300 border border-leaf-400/40"
                : "bg-slate-800/80 text-slate-300/70 hover:bg-slate-700/80"
            )}
          >
            {cat === "all"
              ? "All"
              : cat.replace("_", " ").replace(/\b\w/g, (l) =>
                  l.toUpperCase()
                )}
          </button>
        ))}
      </div>

      {isAdding && (
        <motion.form
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          onSubmit={handleSubmit}
          className="mt-4 space-y-3 rounded-2xl border border-slate-700/40 bg-slate-900/50 p-4"
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-xs uppercase tracking-[0.3em] text-slate-400/70">
              Photo URL
              <input
                type="url"
                value={form.url || ""}
                onChange={(e) => setForm({ ...form, url: e.target.value })}
                required
                placeholder="https://..."
                className="mt-1 w-full rounded-xl border border-slate-600/40 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 focus:border-leaf-500/60 focus:outline-none focus:ring-2 focus:ring-leaf-400/40"
              />
            </label>
            <label className="block text-xs uppercase tracking-[0.3em] text-slate-400/70">
              Category
              <select
                value={form.category}
                onChange={(e) =>
                  setForm({
                    ...form,
                    category: e.target.value as PhotoCategory,
                  })
                }
                className="mt-1 w-full rounded-xl border border-slate-600/40 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 focus:border-leaf-500/60 focus:outline-none focus:ring-2 focus:ring-leaf-400/40"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.replace("_", " ").replace(/\b\w/g, (l) =>
                      l.toUpperCase()
                    )}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-xs uppercase tracking-[0.3em] text-slate-400/70">
              Title
              <input
                type="text"
                value={form.title || ""}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-600/40 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 focus:border-leaf-500/60 focus:outline-none focus:ring-2 focus:ring-leaf-400/40"
              />
            </label>
            <label className="block text-xs uppercase tracking-[0.3em] text-slate-400/70">
              Plantation (optional)
              <select
                value={form.plantationId || ""}
                onChange={(e) =>
                  setForm({ ...form, plantationId: e.target.value || undefined })
                }
                className="mt-1 w-full rounded-xl border border-slate-600/40 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 focus:border-leaf-500/60 focus:outline-none focus:ring-2 focus:ring-leaf-400/40"
              >
                <option value="">None</option>
                {plantations.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.seedName}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-xs uppercase tracking-[0.3em] text-slate-400/70 sm:col-span-2">
              Description
              <textarea
                value={form.description || ""}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                rows={2}
                className="mt-1 w-full rounded-xl border border-slate-600/40 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 focus:border-leaf-500/60 focus:outline-none focus:ring-2 focus:ring-leaf-400/40"
              />
            </label>
          </div>
          <button
            type="submit"
            className="w-full rounded-full bg-leaf-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow-lg transition hover:bg-leaf-400"
          >
            Add photo
          </button>
        </motion.form>
      )}

      <div className="mt-6">
        {filteredPhotos.length === 0 ? (
          <div className="rounded-2xl border border-slate-700/40 bg-slate-900/50 p-8 text-center">
            <p className="text-sm text-slate-300/80">
              {selectedCategory === "all"
                ? "No photos yet. Add your first photo to get started."
                : `No photos in ${selectedCategory} category.`}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredPhotos.map((photo) => {
              const plantation = plantations.find(
                (p) => p.id === photo.plantationId
              );
              return (
                <div
                  key={photo.id}
                  className="group relative overflow-hidden rounded-xl border border-slate-700/40 bg-slate-900/50"
                >
                  <div className="aspect-square bg-slate-800/60">
                    {photo.thumbnailUrl || photo.url ? (
                      <img
                        src={photo.thumbnailUrl || photo.url}
                        alt={photo.title || "Plantation photo"}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-4xl">
                        📷
                      </div>
                    )}
                  </div>
                  <div className="absolute inset-0 bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                    <div className="flex h-full flex-col justify-between p-3">
                      <div>
                        {photo.title && (
                          <p className="text-sm font-semibold text-white">
                            {photo.title}
                          </p>
                        )}
                        {plantation && (
                          <p className="mt-1 text-xs text-slate-200/80">
                            {plantation.seedName}
                          </p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => removePhoto(photo.id)}
                        className="self-end rounded-full bg-slate-800/70 p-2 text-slate-200/90 transition hover:bg-slate-700/80"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                  <div className="absolute top-2 right-2 rounded-full bg-slate-900/80 px-2 py-1 text-xs text-slate-200/90">
                    {photo.category.replace("_", " ")}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </motion.section>
  );
}

