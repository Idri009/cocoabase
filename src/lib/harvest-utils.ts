export type HarvestStatus = "planned" | "in-progress" | "completed" | "cancelled";

export interface HarvestSchedule {
  id: string;
  plantationId: string;
  plannedDate: Date;
  estimatedYield: number;
  actualYield?: number;
  status: HarvestStatus;
  priority: "low" | "medium" | "high";
  assignedTeam?: string[];
  equipment?: string[];
  notes?: string;
}

export const calculateOptimalHarvestWindow = (
  plantationAge: number,
  lastHarvest?: Date,
  growthRate: number = 1.0
): { start: Date; end: Date; optimal: Date } => {
  const baseDays = 180;
  const adjustedDays = baseDays / growthRate;
  const daysSinceLastHarvest = lastHarvest
    ? Math.floor((Date.now() - lastHarvest.getTime()) / (1000 * 60 * 60 * 24))
    : plantationAge;

  const optimalDate = new Date();
  optimalDate.setDate(optimalDate.getDate() + Math.max(0, adjustedDays - daysSinceLastHarvest));

  const start = new Date(optimalDate);
  start.setDate(start.getDate() - 7);

  const end = new Date(optimalDate);
  end.setDate(end.getDate() + 7);

  return { start, end, optimal: optimalDate };
};

export const estimateHarvestYield = (
  plantationArea: number,
  treeDensity: number,
  averageYieldPerTree: number,
  healthFactor: number = 1.0
): number => {
  const totalTrees = plantationArea * treeDensity;
  const baseYield = totalTrees * averageYieldPerTree;
  return baseYield * healthFactor;
};

export const prioritizeHarvests = (
  harvests: HarvestSchedule[]
): HarvestSchedule[] => {
  return [...harvests].sort((a, b) => {
    if (a.status !== b.status) {
      const statusOrder: HarvestStatus[] = ["in-progress", "planned", "completed", "cancelled"];
      return statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status);
    }

    if (a.priority !== b.priority) {
      const priorityOrder: Array<HarvestStatus["priority"]> = ["high", "medium", "low"];
      return priorityOrder.indexOf(a.priority) - priorityOrder.indexOf(b.priority);
    }

    return new Date(a.plannedDate).getTime() - new Date(b.plannedDate).getTime();
  });
};

export const getHarvestsByStatus = (
  harvests: HarvestSchedule[]
): Record<HarvestStatus, HarvestSchedule[]> => {
  return harvests.reduce(
    (acc, harvest) => {
      if (!acc[harvest.status]) {
        acc[harvest.status] = [];
      }
      acc[harvest.status].push(harvest);
      return acc;
    },
    {} as Record<HarvestStatus, HarvestSchedule[]>
  );
};

export const calculateHarvestEfficiency = (
  plannedYield: number,
  actualYield: number
): number => {
  if (plannedYield === 0) return 0;
  return (actualYield / plannedYield) * 100;
};

export const getUpcomingHarvests = (
  harvests: HarvestSchedule[],
  daysAhead: number = 30
): HarvestSchedule[] => {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() + daysAhead);

  return harvests.filter((harvest) => {
    if (harvest.status === "completed" || harvest.status === "cancelled") {
      return false;
    }
    return new Date(harvest.plannedDate) <= cutoffDate;
  });
};

export const checkHarvestReadiness = (
  harvest: HarvestSchedule,
  plantationHealth: number,
  weatherScore: number
): {
  ready: boolean;
  issues: string[];
} => {
  const issues: string[] = [];

  if (plantationHealth < 60) {
    issues.push("Plantation health is below optimal");
  }

  if (weatherScore < 50) {
    issues.push("Weather conditions are not favorable");
  }

  const daysUntilHarvest = Math.floor(
    (new Date(harvest.plannedDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );

  if (daysUntilHarvest < 0 && harvest.status === "planned") {
    issues.push("Harvest date has passed");
  }

  return {
    ready: issues.length === 0,
    issues,
  };
};

