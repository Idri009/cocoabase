import { create } from "zustand";
import {
  persist,
  type PersistOptions,
  createJSONStorage,
} from "zustand/middleware";

export type QualityTestType =
  | "moisture"
  | "bean_count"
  | "fermentation"
  | "flavor"
  | "defect"
  | "other";

export type QualityGrade = "premium" | "grade_a" | "grade_b" | "reject";

export type QualityTest = {
  id: string;
  plantationId: string;
  harvestId?: string;
  testType: QualityTestType;
  grade: QualityGrade;
  result: number;
  unit: string;
  notes?: string;
  testedBy?: string;
  testDate: string;
  createdAt: string;
};

export type QualityTestDraft = Omit<
  QualityTest,
  "id" | "createdAt"
> & {
  id?: string;
};

type QualityControlState = {
  tests: QualityTest[];
  addTest: (draft: QualityTestDraft) => void;
  updateTest: (id: string, updates: Partial<QualityTestDraft>) => void;
  removeTest: (id: string) => void;
  getTestsByPlantation: (plantationId: string) => QualityTest[];
  getTestsByGrade: (grade: QualityGrade) => QualityTest[];
  getAverageGrade: (plantationId?: string) => QualityGrade | null;
};

const generateTestId = () =>
  `qt_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

export const useQualityControlStore = create<QualityControlState>()(
  persist(
    (set, get) => ({
      tests: [],

      addTest: (draft) => {
        const now = new Date().toISOString();
        const test: QualityTest = {
          ...draft,
          id: draft.id ?? generateTestId(),
          createdAt: now,
        };
        set((state) => ({
          tests: [...state.tests, test],
        }));
      },

      updateTest: (id, updates) => {
        set((state) => ({
          tests: state.tests.map((test) =>
            test.id === id ? { ...test, ...updates } : test
          ),
        }));
      },

      removeTest: (id) => {
        set((state) => ({
          tests: state.tests.filter((test) => test.id !== id),
        }));
      },

      getTestsByPlantation: (plantationId) => {
        return get().tests.filter((test) => test.plantationId === plantationId);
      },

      getTestsByGrade: (grade) => {
        return get().tests.filter((test) => test.grade === grade);
      },

      getAverageGrade: (plantationId) => {
        const relevantTests = plantationId
          ? get().getTestsByPlantation(plantationId)
          : get().tests;
        if (relevantTests.length === 0) return null;

        const gradeValues: Record<QualityGrade, number> = {
          premium: 4,
          grade_a: 3,
          grade_b: 2,
          reject: 1,
        };

        const average =
          relevantTests.reduce(
            (sum, test) => sum + gradeValues[test.grade],
            0
          ) / relevantTests.length;

        if (average >= 3.5) return "premium";
        if (average >= 2.5) return "grade_a";
        if (average >= 1.5) return "grade_b";
        return "reject";
      },
    }),
    {
      name: "cocoa-chain-quality-control",
      storage: createJSONStorage(() => localStorage),
    } as PersistOptions<QualityControlState>
  )
);

