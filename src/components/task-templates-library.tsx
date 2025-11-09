"use client";

import { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import {
  useTaskTemplatesStore,
  type TaskTemplate,
  type TaskTemplateCategory,
} from "@/store/task-templates";
import { usePlantationsStore } from "@/store/plantations";

export default function TaskTemplatesLibrary() {
  const templates = useTaskTemplatesStore((state) => state.templates);
  const addTemplate = useTaskTemplatesStore((state) => state.addTemplate);
  const removeTemplate = useTaskTemplatesStore((state) => state.removeTemplate);
  const getTemplatesByCategory = useTaskTemplatesStore(
    (state) => state.getTemplatesByCategory
  );
  const plantations = usePlantationsStore((state) => state.plantations);

  const [isAdding, setIsAdding] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<
    TaskTemplateCategory | "all"
  >("all");
  const [form, setForm] = useState<Partial<TaskTemplate>>({
    category: "planting",
    steps: [],
    requiredTools: [],
    requiredMaterials: [],
    isDefault: false,
  });

  const filteredTemplates =
    selectedCategory === "all"
      ? templates
      : getTemplatesByCategory(selectedCategory);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.description) {
      return;
    }
    addTemplate({
      category: form.category ?? "planting",
      title: form.title,
      description: form.description,
      estimatedDuration: form.estimatedDuration,
      requiredTools: form.requiredTools || [],
      requiredMaterials: form.requiredMaterials || [],
      steps: form.steps || [],
      isDefault: form.isDefault || false,
    });
    setForm({
      category: "planting",
      steps: [],
      requiredTools: [],
      requiredMaterials: [],
      isDefault: false,
    });
    setIsAdding(false);
  };

  const categories: TaskTemplateCategory[] = [
    "planting",
    "maintenance",
    "harvest",
    "irrigation",
    "pest_control",
    "fertilization",
    "other",
  ];

  const getCategoryColor = (category: TaskTemplateCategory) => {
    switch (category) {
      case "planting":
        return "border-emerald-500/60 bg-emerald-500/20";
      case "maintenance":
        return "border-blue-500/60 bg-blue-500/20";
      case "harvest":
        return "border-amber-500/60 bg-amber-500/20";
      case "irrigation":
        return "border-cyan-500/60 bg-cyan-500/20";
      case "pest_control":
        return "border-rose-500/60 bg-rose-500/20";
      case "fertilization":
        return "border-purple-500/60 bg-purple-500/20";
      default:
        return "border-slate-500/60 bg-slate-500/20";
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 }}
      className="rounded-3xl border border-cocoa-800/60 bg-[#101f3c]/80 p-6 text-slate-100 shadow-xl shadow-black/20 backdrop-blur"
    >
      <header className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">
            Task templates library
          </h2>
          <p className="text-sm text-slate-300/80">
            Pre-defined task templates for common operations.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsAdding(!isAdding)}
          className="rounded-full bg-leaf-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow-lg transition hover:bg-leaf-400"
        >
          {isAdding ? "Cancel" : "+ Add template"}
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
              Title
              <input
                type="text"
                value={form.title || ""}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
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
                    category: e.target.value as TaskTemplateCategory,
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
            <label className="block text-xs uppercase tracking-[0.3em] text-slate-400/70 sm:col-span-2">
              Description
              <textarea
                value={form.description || ""}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                required
                rows={2}
                className="mt-1 w-full rounded-xl border border-slate-600/40 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 focus:border-leaf-500/60 focus:outline-none focus:ring-2 focus:ring-leaf-400/40"
              />
            </label>
          </div>
          <button
            type="submit"
            className="w-full rounded-full bg-leaf-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow-lg transition hover:bg-leaf-400"
          >
            Add template
          </button>
        </motion.form>
      )}

      <div className="mt-6 space-y-3">
        {filteredTemplates.length === 0 ? (
          <div className="rounded-2xl border border-slate-700/40 bg-slate-900/50 p-8 text-center">
            <p className="text-sm text-slate-300/80">
              {selectedCategory === "all"
                ? "No templates yet. Add your first template to get started."
                : `No templates in ${selectedCategory} category.`}
            </p>
          </div>
        ) : (
          filteredTemplates.map((template) => (
            <div
              key={template.id}
              className={cn(
                "rounded-xl border p-4",
                getCategoryColor(template.category)
              )}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-white">
                      {template.title}
                    </h3>
                    {template.isDefault && (
                      <span className="rounded-full bg-slate-800/80 px-2 py-0.5 text-xs text-slate-300/70">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-slate-300/70">
                    {template.description}
                  </p>
                  {template.steps.length > 0 && (
                    <div className="mt-2">
                      <p className="text-xs font-semibold text-slate-200/80">
                        Steps:
                      </p>
                      <ol className="mt-1 list-decimal list-inside space-y-0.5 text-xs text-slate-300/70">
                        {template.steps.map((step, idx) => (
                          <li key={idx}>{step}</li>
                        ))}
                      </ol>
                    </div>
                  )}
                  {(template.requiredTools?.length || 0) > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {template.requiredTools?.map((tool) => (
                        <span
                          key={tool}
                          className="rounded-full bg-slate-800/80 px-2 py-0.5 text-xs text-slate-300/70"
                        >
                          🔧 {tool}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                {!template.isDefault && (
                  <button
                    type="button"
                    onClick={() => removeTemplate(template.id)}
                    className="ml-2 rounded-full bg-slate-800/70 p-2 text-slate-200/90 transition hover:bg-slate-700/80"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </motion.section>
  );
}

