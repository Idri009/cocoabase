import { create } from "zustand";
import {
  persist,
  type PersistOptions,
  createJSONStorage,
} from "zustand/middleware";

export type TaskTemplateCategory =
  | "planting"
  | "maintenance"
  | "harvest"
  | "irrigation"
  | "pest_control"
  | "fertilization"
  | "other";

export type TaskTemplate = {
  id: string;
  category: TaskTemplateCategory;
  title: string;
  description: string;
  estimatedDuration?: number;
  requiredTools?: string[];
  requiredMaterials?: string[];
  steps: string[];
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
};

export type TaskTemplateDraft = Omit<
  TaskTemplate,
  "id" | "createdAt" | "updatedAt"
> & {
  id?: string;
};

type TaskTemplatesState = {
  templates: TaskTemplate[];
  addTemplate: (draft: TaskTemplateDraft) => void;
  updateTemplate: (id: string, updates: Partial<TaskTemplateDraft>) => void;
  removeTemplate: (id: string) => void;
  getTemplatesByCategory: (category: TaskTemplateCategory) => TaskTemplate[];
  getDefaultTemplates: () => TaskTemplate[];
};

const generateTemplateId = () =>
  `template_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

export const useTaskTemplatesStore = create<TaskTemplatesState>()(
  persist(
    (set, get) => ({
      templates: [
        {
          id: "planting_default",
          category: "planting",
          title: "Plant Cocoa Seedlings",
          description: "Standard procedure for planting cocoa seedlings",
          estimatedDuration: 240,
          requiredTools: ["shovel", "watering can", "measuring tape"],
          requiredMaterials: ["seedlings", "fertilizer", "mulch"],
          steps: [
            "Prepare planting holes (2m x 2m spacing)",
            "Add organic fertilizer to each hole",
            "Plant seedling at correct depth",
            "Water thoroughly",
            "Apply mulch around base",
          ],
          isDefault: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "pruning_default",
          category: "maintenance",
          title: "Prune Cocoa Trees",
          description: "Regular pruning to maintain tree health",
          estimatedDuration: 180,
          requiredTools: ["pruning shears", "ladder", "saw"],
          requiredMaterials: ["pruning sealant"],
          steps: [
            "Identify dead or diseased branches",
            "Remove crossing branches",
            "Prune to maintain canopy shape",
            "Apply sealant to large cuts",
            "Clean up debris",
          ],
          isDefault: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],

      addTemplate: (draft) => {
        const now = new Date().toISOString();
        const template: TaskTemplate = {
          ...draft,
          id: draft.id ?? generateTemplateId(),
          steps: draft.steps || [],
          requiredTools: draft.requiredTools || [],
          requiredMaterials: draft.requiredMaterials || [],
          isDefault: draft.isDefault || false,
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({
          templates: [...state.templates, template],
        }));
      },

      updateTemplate: (id, updates) => {
        set((state) => ({
          templates: state.templates.map((template) =>
            template.id === id
              ? { ...template, ...updates, updatedAt: new Date().toISOString() }
              : template
          ),
        }));
      },

      removeTemplate: (id) => {
        set((state) => ({
          templates: state.templates.filter((template) => template.id !== id),
        }));
      },

      getTemplatesByCategory: (category) => {
        return get().templates.filter(
          (template) => template.category === category
        );
      },

      getDefaultTemplates: () => {
        return get().templates.filter((template) => template.isDefault);
      },
    }),
    {
      name: "cocoa-chain-task-templates",
      storage: createJSONStorage(() => localStorage),
    } as PersistOptions<TaskTemplatesState>
  )
);

