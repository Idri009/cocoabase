export type TrainingCategory = 
  | "planting"
  | "pests"
  | "harvest"
  | "soil"
  | "irrigation"
  | "certification"
  | "business"
  | "sustainability";

export type TrainingLevel = "beginner" | "intermediate" | "advanced";

export interface TrainingResource {
  id: string;
  title: string;
  description: string;
  category: TrainingCategory;
  level: TrainingLevel;
  duration: number;
  type: "article" | "video" | "course" | "guide" | "tutorial";
  url?: string;
  content?: string;
  tags?: string[];
  createdAt: Date;
  updatedAt?: Date;
}

export interface TrainingProgress {
  resourceId: string;
  userId: string;
  completed: boolean;
  progress: number;
  startedAt?: Date;
  completedAt?: Date;
  notes?: string;
}

export const getResourcesByCategory = (
  resources: TrainingResource[]
): Record<TrainingCategory, TrainingResource[]> => {
  return resources.reduce(
    (acc, resource) => {
      if (!acc[resource.category]) {
        acc[resource.category] = [];
      }
      acc[resource.category].push(resource);
      return acc;
    },
    {
      planting: [],
      pests: [],
      harvest: [],
      soil: [],
      irrigation: [],
      certification: [],
      business: [],
      sustainability: [],
    } as Record<TrainingCategory, TrainingResource[]>
  );
};

export const getResourcesByLevel = (
  resources: TrainingResource[]
): Record<TrainingLevel, TrainingResource[]> => {
  return resources.reduce(
    (acc, resource) => {
      if (!acc[resource.level]) {
        acc[resource.level] = [];
      }
      acc[resource.level].push(resource);
      return acc;
    },
    {
      beginner: [],
      intermediate: [],
      advanced: [],
    } as Record<TrainingLevel, TrainingResource[]>
  );
};

export const searchTrainingResources = (
  resources: TrainingResource[],
  query: string
): TrainingResource[] => {
  const lowerQuery = query.toLowerCase();
  return resources.filter((resource) => {
    return (
      resource.title.toLowerCase().includes(lowerQuery) ||
      resource.description.toLowerCase().includes(lowerQuery) ||
      resource.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery)) ||
      resource.category.toLowerCase().includes(lowerQuery)
    );
  });
};

export const getRecommendedResources = (
  resources: TrainingResource[],
  userLevel: TrainingLevel,
  interests?: TrainingCategory[]
): TrainingResource[] => {
  let filtered = resources.filter((r) => r.level === userLevel || r.level === "beginner");

  if (interests && interests.length > 0) {
    filtered = filtered.filter((r) => interests.includes(r.category));
  }

  return filtered.slice(0, 10);
};

export const calculateTrainingProgress = (
  progress: TrainingProgress[]
): {
  total: number;
  completed: number;
  inProgress: number;
  notStarted: number;
  completionRate: number;
} => {
  const total = progress.length;
  const completed = progress.filter((p) => p.completed).length;
  const inProgress = progress.filter((p) => !p.completed && p.progress > 0).length;
  const notStarted = progress.filter((p) => p.progress === 0 && !p.completed).length;
  const completionRate = total > 0 ? (completed / total) * 100 : 0;

  return {
    total,
    completed,
    inProgress,
    notStarted,
    completionRate,
  };
};

export const formatTrainingCategory = (category: TrainingCategory): string => {
  const labels: Record<TrainingCategory, string> = {
    planting: "Planting",
    pests: "Pest & Disease Management",
    harvest: "Harvesting",
    soil: "Soil Management",
    irrigation: "Irrigation",
    certification: "Certification",
    business: "Business Management",
    sustainability: "Sustainability",
  };
  return labels[category];
};

export const formatTrainingDuration = (minutes: number): string => {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
};

