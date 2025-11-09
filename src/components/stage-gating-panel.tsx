"use client";

import { useMemo, useState, FormEvent } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import {
  usePlantationsStore,
  type GrowthStage,
  type StageGateRuleDraft,
  type StageGateValidationResult,
} from "@/store/plantations";

const stageLabels: Record<GrowthStage, string> = {
  planted: "Planted",
  growing: "Growing",
  harvested: "Harvested",
};

const stageOptions: Array<{ value: GrowthStage; label: string }> = [
  { value: "planted", label: "Planted" },
  { value: "growing", label: "Growing" },
  { value: "harvested", label: "Harvested" },
];

type NewRuleFormState = {
  targetStage: GrowthStage;
  requiredTasksCompleted: string;
  minimumDaysInCurrentStage: string;
  minimumYieldCheckpoints: string;
  requireCoordinates: boolean;
  requireCollaborators: string;
  enabled: boolean;
};

const defaultFormState: NewRuleFormState = {
  targetStage: "growing",
  requiredTasksCompleted: "",
  minimumDaysInCurrentStage: "",
  minimumYieldCheckpoints: "",
  requireCoordinates: false,
  requireCollaborators: "",
  enabled: true,
};

export default function StageGatingPanel() {
  const gateRules = usePlantationsStore((state) => state.gateRules);
  const addGateRule = usePlantationsStore((state) => state.addGateRule);
  const updateGateRule = usePlantationsStore((state) => state.updateGateRule);
  const removeGateRule = usePlantationsStore((state) => state.removeGateRule);
  const plantations = usePlantationsStore((state) => state.plantations);
  const validateStageTransition = usePlantationsStore(
    (state) => state.validateStageTransition
  );

  const [form, setForm] = useState<NewRuleFormState>(defaultFormState);
  const [selectedRuleId, setSelectedRuleId] = useState<string | null>(null);
  const [testPlantationId, setTestPlantationId] = useState<string>("");
  const [testTargetStage, setTestTargetStage] = useState<GrowthStage>("growing");
  const [testResult, setTestResult] = useState<StageGateValidationResult | null>(
    null
  );

  const selectedRule = useMemo(
    () => gateRules.find((rule) => rule.id === selectedRuleId),
    [gateRules, selectedRuleId]
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const ruleDraft: StageGateRuleDraft = {
      targetStage: form.targetStage,
      requiredTasksCompleted:
        form.requiredTasksCompleted.trim() !== ""
          ? Number.parseInt(form.requiredTasksCompleted, 10)
          : undefined,
      minimumDaysInCurrentStage:
        form.minimumDaysInCurrentStage.trim() !== ""
          ? Number.parseInt(form.minimumDaysInCurrentStage, 10)
          : undefined,
      minimumYieldCheckpoints:
        form.minimumYieldCheckpoints.trim() !== ""
          ? Number.parseInt(form.minimumYieldCheckpoints, 10)
          : undefined,
      requireCoordinates: form.requireCoordinates || undefined,
      requireCollaborators:
        form.requireCollaborators.trim() !== ""
          ? Number.parseInt(form.requireCollaborators, 10)
          : undefined,
      enabled: form.enabled,
    };

    addGateRule(ruleDraft);
    setForm(defaultFormState);
  };

  const handleTestValidation = () => {
    if (!testPlantationId) {
      return;
    }
    const plantation = plantations.find((p) => p.id === testPlantationId);
    if (!plantation) {
      return;
    }
    const result = validateStageTransition(plantation, testTargetStage);
    setTestResult(result);
  };

  const rulesByStage = useMemo(() => {
    const grouped: Record<GrowthStage, typeof gateRules> = {
      planted: [],
      growing: [],
      harvested: [],
    };
    gateRules.forEach((rule) => {
      grouped[rule.targetStage].push(rule);
    });
    return grouped;
  }, [gateRules]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 }}
      className="rounded-3xl border border-cocoa-800/60 bg-[#101f3c]/80 p-6 text-slate-100 shadow-xl shadow-black/20 backdrop-blur"
    >
      <header className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">Stage gating rules</h2>
          <p className="text-sm text-slate-300/80">
            Define prerequisites that must be met before advancing plantations to
            specific stages.
          </p>
        </div>
        <span className="rounded-full bg-slate-900/60 px-3 py-1 text-xs uppercase tracking-[0.3em] text-slate-300/70">
          {gateRules.length} rule{gateRules.length === 1 ? "" : "s"}
        </span>
      </header>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-300/70">
            Create new rule
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block text-xs uppercase tracking-[0.3em] text-slate-400/70">
              Target stage
              <select
                value={form.targetStage}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    targetStage: event.target.value as GrowthStage,
                  }))
                }
                className="mt-1 w-full rounded-xl border border-slate-600/40 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 focus:border-leaf-500/60 focus:outline-none focus:ring-2 focus:ring-leaf-400/40"
              >
                {stageOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block text-xs uppercase tracking-[0.3em] text-slate-400/70">
                Min. completed tasks
                <input
                  type="number"
                  min="0"
                  value={form.requiredTasksCompleted}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      requiredTasksCompleted: event.target.value,
                    }))
                  }
                  className="mt-1 w-full rounded-xl border border-slate-600/40 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 focus:border-leaf-500/60 focus:outline-none focus:ring-2 focus:ring-leaf-400/40"
                  placeholder="Optional"
                />
              </label>
              <label className="block text-xs uppercase tracking-[0.3em] text-slate-400/70">
                Min. days in stage
                <input
                  type="number"
                  min="0"
                  value={form.minimumDaysInCurrentStage}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      minimumDaysInCurrentStage: event.target.value,
                    }))
                  }
                  className="mt-1 w-full rounded-xl border border-slate-600/40 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 focus:border-leaf-500/60 focus:outline-none focus:ring-2 focus:ring-leaf-400/40"
                  placeholder="Optional"
                />
              </label>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block text-xs uppercase tracking-[0.3em] text-slate-400/70">
                Min. yield checkpoints
                <input
                  type="number"
                  min="0"
                  value={form.minimumYieldCheckpoints}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      minimumYieldCheckpoints: event.target.value,
                    }))
                  }
                  className="mt-1 w-full rounded-xl border border-slate-600/40 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 focus:border-leaf-500/60 focus:outline-none focus:ring-2 focus:ring-leaf-400/40"
                  placeholder="Optional"
                />
              </label>
              <label className="block text-xs uppercase tracking-[0.3em] text-slate-400/70">
                Min. collaborators
                <input
                  type="number"
                  min="0"
                  value={form.requireCollaborators}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      requireCollaborators: event.target.value,
                    }))
                  }
                  className="mt-1 w-full rounded-xl border border-slate-600/40 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 focus:border-leaf-500/60 focus:outline-none focus:ring-2 focus:ring-leaf-400/40"
                  placeholder="Optional"
                />
              </label>
            </div>

            <label className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-slate-400/70">
              <input
                type="checkbox"
                checked={form.requireCoordinates}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    requireCoordinates: event.target.checked,
                  }))
                }
                className="rounded border-slate-600/40 bg-slate-950/60 text-leaf-500 focus:ring-2 focus:ring-leaf-400/40"
              />
              Require coordinates
            </label>

            <label className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-slate-400/70">
              <input
                type="checkbox"
                checked={form.enabled}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    enabled: event.target.checked,
                  }))
                }
                className="rounded border-slate-600/40 bg-slate-950/60 text-leaf-500 focus:ring-2 focus:ring-leaf-400/40"
              />
              Enabled
            </label>

            <button
              type="submit"
              className="w-full rounded-full bg-leaf-500 px-5 py-2 text-sm font-semibold text-slate-950 shadow-lg transition hover:bg-leaf-400 focus:outline-none focus:ring-2 focus:ring-leaf-300 focus:ring-offset-2 focus:ring-offset-slate-900/60"
            >
              Add rule
            </button>
          </form>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-300/70">
            Test validation
          </h3>
          <div className="space-y-3 rounded-2xl border border-slate-700/40 bg-slate-900/50 p-4">
            <label className="block text-xs uppercase tracking-[0.3em] text-slate-400/70">
              Plantation
              <select
                value={testPlantationId}
                onChange={(event) => setTestPlantationId(event.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-600/40 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 focus:border-leaf-500/60 focus:outline-none focus:ring-2 focus:ring-leaf-400/40"
              >
                <option value="">Select plantation</option>
                {plantations.map((plantation) => (
                  <option key={plantation.id} value={plantation.id}>
                    {plantation.seedName} ({stageLabels[plantation.stage]})
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-xs uppercase tracking-[0.3em] text-slate-400/70">
              Target stage
              <select
                value={testTargetStage}
                onChange={(event) =>
                  setTestTargetStage(event.target.value as GrowthStage)
                }
                className="mt-1 w-full rounded-xl border border-slate-600/40 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 focus:border-leaf-500/60 focus:outline-none focus:ring-2 focus:ring-leaf-400/40"
              >
                {stageOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="button"
              onClick={handleTestValidation}
              disabled={!testPlantationId}
              className="w-full rounded-full bg-slate-800/70 px-4 py-2 text-sm font-semibold text-slate-200/90 transition hover:bg-slate-700/80 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Test validation
            </button>
            {testResult && (
              <div
                className={cn(
                  "rounded-xl border p-3 text-xs",
                  testResult.canProceed
                    ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-200"
                    : "border-rose-500/40 bg-rose-500/10 text-rose-200"
                )}
              >
                <p className="font-semibold">
                  {testResult.canProceed ? "✓ Can proceed" : "✗ Blocked"}
                </p>
                {testResult.blockingReasons.length > 0 && (
                  <ul className="mt-2 list-disc pl-4 space-y-1">
                    {testResult.blockingReasons.map((reason, index) => (
                      <li key={index}>{reason}</li>
                    ))}
                  </ul>
                )}
                {testResult.warnings.length > 0 && (
                  <ul className="mt-2 list-disc pl-4 space-y-1 text-amber-200">
                    {testResult.warnings.map((warning, index) => (
                      <li key={index}>{warning}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-300/70">
          Active rules
        </h3>
        {gateRules.length === 0 ? (
          <p className="mt-4 text-sm text-slate-300/80">
            No gating rules defined. Create a rule above to enforce prerequisites
            for stage transitions.
          </p>
        ) : (
          <div className="mt-4 space-y-3">
            {Object.entries(rulesByStage).map(([stage, rules]) => {
              if (rules.length === 0) {
                return null;
              }
              return (
                <div
                  key={stage}
                  className="rounded-2xl border border-slate-700/40 bg-slate-900/50 p-4"
                >
                  <h4 className="text-sm font-semibold text-white">
                    {stageLabels[stage as GrowthStage]}
                  </h4>
                  <ul className="mt-2 space-y-2">
                    {rules.map((rule) => (
                      <li
                        key={rule.id}
                        className="flex items-start justify-between gap-3 rounded-xl border border-slate-700/40 bg-slate-950/60 p-3"
                      >
                        <div className="flex-1 space-y-1 text-xs text-slate-300/80">
                          <div className="flex items-center gap-2">
                            <span
                              className={cn(
                                "h-2 w-2 rounded-full",
                                rule.enabled
                                  ? "bg-emerald-400"
                                  : "bg-slate-500"
                              )}
                            />
                            <span className="font-semibold text-slate-200">
                              Rule {rule.id.slice(-6)}
                            </span>
                          </div>
                          <ul className="ml-4 list-disc space-y-0.5">
                            {rule.requiredTasksCompleted !== undefined && (
                              <li>
                                Requires {rule.requiredTasksCompleted} completed
                                tasks
                              </li>
                            )}
                            {rule.minimumDaysInCurrentStage !== undefined && (
                              <li>
                                Minimum {rule.minimumDaysInCurrentStage} days in
                                current stage
                              </li>
                            )}
                            {rule.minimumYieldCheckpoints !== undefined && (
                              <li>
                                Minimum {rule.minimumYieldCheckpoints} yield
                                checkpoints
                              </li>
                            )}
                            {rule.requireCoordinates && (
                              <li>Coordinates required</li>
                            )}
                            {rule.requireCollaborators !== undefined && (
                              <li>
                                Requires {rule.requireCollaborators}{" "}
                                collaborator
                                {rule.requireCollaborators === 1 ? "" : "s"}
                              </li>
                            )}
                          </ul>
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              updateGateRule(rule.id, {
                                enabled: !rule.enabled,
                              })
                            }
                            className={cn(
                              "rounded-full px-3 py-1 text-xs font-semibold transition",
                              rule.enabled
                                ? "bg-slate-800/70 text-slate-200/90 hover:bg-slate-700/80"
                                : "bg-slate-700/40 text-slate-400/70 hover:bg-slate-600/50"
                            )}
                          >
                            {rule.enabled ? "Disable" : "Enable"}
                          </button>
                          <button
                            type="button"
                            onClick={() => removeGateRule(rule.id)}
                            className="rounded-full bg-rose-600/20 px-3 py-1 text-xs font-semibold text-rose-300 transition hover:bg-rose-600/30"
                          >
                            Remove
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </motion.section>
  );
}

