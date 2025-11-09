import { create } from "zustand";
import {
  persist,
  type PersistOptions,
  createJSONStorage,
} from "zustand/middleware";

export type RiskCategory =
  | "weather"
  | "pest_disease"
  | "market"
  | "financial"
  | "operational"
  | "regulatory"
  | "other";

export type RiskLevel = "low" | "medium" | "high" | "critical";

export type RiskAssessment = {
  id: string;
  category: RiskCategory;
  title: string;
  description: string;
  plantationId?: string;
  riskLevel: RiskLevel;
  probability: number;
  impact: number;
  mitigationStrategy?: string;
  status: "identified" | "mitigated" | "resolved" | "monitoring";
  identifiedDate: string;
  resolvedDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

export type RiskAssessmentDraft = Omit<
  RiskAssessment,
  "id" | "createdAt" | "updatedAt"
> & {
  id?: string;
};

type RiskAssessmentState = {
  assessments: RiskAssessment[];
  addAssessment: (draft: RiskAssessmentDraft) => void;
  updateAssessment: (
    id: string,
    updates: Partial<RiskAssessmentDraft>
  ) => void;
  removeAssessment: (id: string) => void;
  getAssessmentsByLevel: (level: RiskLevel) => RiskAssessment[];
  getAssessmentsByCategory: (category: RiskCategory) => RiskAssessment[];
  getActiveRisks: () => RiskAssessment[];
};

const generateRiskId = () =>
  `risk_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

export const useRiskAssessmentStore = create<RiskAssessmentState>()(
  persist(
    (set, get) => ({
      assessments: [],

      addAssessment: (draft) => {
        const now = new Date().toISOString();
        const assessment: RiskAssessment = {
          ...draft,
          id: draft.id ?? generateRiskId(),
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({
          assessments: [...state.assessments, assessment],
        }));
      },

      updateAssessment: (id, updates) => {
        set((state) => ({
          assessments: state.assessments.map((assessment) =>
            assessment.id === id
              ? {
                  ...assessment,
                  ...updates,
                  updatedAt: new Date().toISOString(),
                }
              : assessment
          ),
        }));
      },

      removeAssessment: (id) => {
        set((state) => ({
          assessments: state.assessments.filter(
            (assessment) => assessment.id !== id
          ),
        }));
      },

      getAssessmentsByLevel: (level) => {
        return get().assessments.filter(
          (assessment) => assessment.riskLevel === level
        );
      },

      getAssessmentsByCategory: (category) => {
        return get().assessments.filter(
          (assessment) => assessment.category === category
        );
      },

      getActiveRisks: () => {
        return get().assessments.filter(
          (assessment) =>
            assessment.status === "identified" ||
            assessment.status === "monitoring"
        );
      },
    }),
    {
      name: "cocoa-chain-risk-assessment",
      storage: createJSONStorage(() => localStorage),
    } as PersistOptions<RiskAssessmentState>
  )
);

