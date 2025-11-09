export type CarbonProjectionPeriod = "30d" | "90d" | "1y";

export interface CarbonProjection {
  period: CarbonProjectionPeriod;
  currentOffset: number;
  projectedOffset: number;
  potentialIncrease: number;
  trees: number;
  areaHectares: number;
}

export interface CarbonMetrics {
  currentOffset: number;
  trees: number;
  areaHectares: number;
  averageAge: number;
  growthRate: number;
}

export const CARBON_FACTORS = {
  COCOA_TREE_PER_YEAR: 0.025,
  HECTARE_PER_YEAR: 2.5,
  MATURE_TREE_MULTIPLIER: 1.5,
  GROWTH_STAGE_MULTIPLIERS: {
    seedling: 0.2,
    vegetative: 0.5,
    flowering: 0.8,
    fruiting: 1.0,
    harvest: 1.2,
  },
};

export const calculateCurrentCarbonOffset = (
  trees: number,
  areaHectares: number,
  averageAge: number = 1
): number => {
  const treeOffset = trees * CARBON_FACTORS.COCOA_TREE_PER_YEAR * averageAge;
  const areaOffset = areaHectares * CARBON_FACTORS.HECTARE_PER_YEAR * averageAge;
  return (treeOffset + areaOffset) / 2;
};

export const calculateProjectedCarbonOffset = (
  metrics: CarbonMetrics,
  period: CarbonProjectionPeriod
): CarbonProjection => {
  const days = period === "30d" ? 30 : period === "90d" ? 90 : 365;
  const years = days / 365;

  const currentOffset = calculateCurrentCarbonOffset(
    metrics.trees,
    metrics.areaHectares,
    metrics.averageAge
  );

  const futureAge = metrics.averageAge + years;
  const projectedOffset = calculateCurrentCarbonOffset(
    metrics.trees,
    metrics.areaHectares,
    futureAge
  );

  const potentialIncrease = projectedOffset - currentOffset;

  return {
    period,
    currentOffset,
    projectedOffset,
    potentialIncrease,
    trees: metrics.trees,
    areaHectares: metrics.areaHectares,
  };
};

export const calculateAllProjections = (
  metrics: CarbonMetrics
): CarbonProjection[] => {
  return [
    calculateProjectedCarbonOffset(metrics, "30d"),
    calculateProjectedCarbonOffset(metrics, "90d"),
    calculateProjectedCarbonOffset(metrics, "1y"),
  ];
};

export const calculateCarbonPerTree = (totalOffset: number, treeCount: number): number => {
  if (treeCount === 0) return 0;
  return totalOffset / treeCount;
};

export const calculateCarbonPerHectare = (
  totalOffset: number,
  areaHectares: number
): number => {
  if (areaHectares === 0) return 0;
  return totalOffset / areaHectares;
};

export const calculateCarbonEfficiency = (
  offset: number,
  trees: number,
  areaHectares: number
): {
  perTree: number;
  perHectare: number;
  efficiencyScore: number;
} => {
  const perTree = calculateCarbonPerTree(offset, trees);
  const perHectare = calculateCarbonPerHectare(offset, areaHectares);

  const idealPerTree = CARBON_FACTORS.COCOA_TREE_PER_YEAR;
  const idealPerHectare = CARBON_FACTORS.HECTARE_PER_YEAR;

  const treeEfficiency = idealPerTree > 0 ? (perTree / idealPerTree) * 100 : 0;
  const hectareEfficiency = idealPerHectare > 0 ? (perHectare / idealPerHectare) * 100 : 0;

  const efficiencyScore = (treeEfficiency + hectareEfficiency) / 2;

  return {
    perTree,
    perHectare,
    efficiencyScore: Math.min(100, Math.max(0, efficiencyScore)),
  };
};

export const formatCarbonOffset = (tons: number): string => {
  if (tons >= 1000) {
    return `${(tons / 1000).toFixed(2)}K tCO₂`;
  }
  return `${tons.toFixed(2)} tCO₂`;
};

export const calculateCarbonSavings = (
  currentOffset: number,
  projectedOffset: number
): {
  savings: number;
  percentage: number;
} => {
  const savings = projectedOffset - currentOffset;
  const percentage = currentOffset > 0 ? (savings / currentOffset) * 100 : 0;
  return { savings, percentage };
};

