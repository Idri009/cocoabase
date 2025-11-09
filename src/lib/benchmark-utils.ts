export type BenchmarkCategory = 
  | "yield"
  | "cost"
  | "quality"
  | "efficiency"
  | "sustainability"
  | "labor";

export interface Benchmark {
  id: string;
  category: BenchmarkCategory;
  metric: string;
  value: number;
  unit: string;
  period: string;
  target?: number;
  industryAverage?: number;
  bestInClass?: number;
}

export interface PerformanceMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  category: BenchmarkCategory;
  target?: number;
  benchmark?: number;
}

export const calculatePerformanceGap = (
  current: number,
  target: number
): { gap: number; percentage: number } => {
  const gap = target - current;
  const percentage = target !== 0 ? (gap / target) * 100 : 0;
  return { gap, percentage };
};

export const compareToBenchmark = (
  value: number,
  benchmark: number
): {
  difference: number;
  percentage: number;
  status: "above" | "below" | "at";
} => {
  const difference = value - benchmark;
  const percentage = benchmark !== 0 ? (difference / benchmark) * 100 : 0;
  
  let status: "above" | "below" | "at" = "at";
  if (Math.abs(percentage) < 1) {
    status = "at";
  } else if (difference > 0) {
    status = "above";
  } else {
    status = "below";
  }

  return { difference, percentage, status };
};

export const calculateKPIScore = (
  metrics: PerformanceMetric[]
): number => {
  if (metrics.length === 0) return 0;

  let totalScore = 0;
  metrics.forEach((metric) => {
    if (metric.target !== undefined) {
      const performance = (metric.value / metric.target) * 100;
      totalScore += Math.min(100, Math.max(0, performance));
    } else if (metric.benchmark !== undefined) {
      const comparison = compareToBenchmark(metric.value, metric.benchmark);
      totalScore += comparison.status === "above" ? 100 : 50 + comparison.percentage;
    } else {
      totalScore += 50;
    }
  });

  return totalScore / metrics.length;
};

export const getBenchmarkComparison = (
  value: number,
  industryAverage?: number,
  bestInClass?: number
): {
  vsIndustry: { difference: number; percentage: number } | null;
  vsBestInClass: { difference: number; percentage: number } | null;
} => {
  return {
    vsIndustry: industryAverage
      ? {
          difference: value - industryAverage,
          percentage: industryAverage !== 0
            ? ((value - industryAverage) / industryAverage) * 100
            : 0,
        }
      : null,
    vsBestInClass: bestInClass
      ? {
          difference: value - bestInClass,
          percentage: bestInClass !== 0
            ? ((value - bestInClass) / bestInClass) * 100
            : 0,
        }
      : null,
  };
};

export const identifyImprovementAreas = (
  metrics: PerformanceMetric[]
): PerformanceMetric[] => {
  return metrics.filter((metric) => {
    if (metric.target !== undefined) {
      return metric.value < metric.target * 0.9;
    }
    if (metric.benchmark !== undefined) {
      return metric.value < metric.benchmark;
    }
    return false;
  });
};

export const calculateTrend = (
  values: number[]
): "improving" | "declining" | "stable" => {
  if (values.length < 2) return "stable";

  const recent = values.slice(-3);
  const older = values.slice(0, Math.max(0, values.length - 3));

  if (older.length === 0) return "stable";

  const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
  const olderAvg = older.reduce((a, b) => a + b, 0) / older.length;

  const change = ((recentAvg - olderAvg) / olderAvg) * 100;

  if (change > 5) return "improving";
  if (change < -5) return "declining";
  return "stable";
};

export const getPerformanceRating = (score: number): {
  rating: "excellent" | "good" | "average" | "poor";
  color: string;
} => {
  if (score >= 90) {
    return { rating: "excellent", color: "green" };
  }
  if (score >= 75) {
    return { rating: "good", color: "blue" };
  }
  if (score >= 60) {
    return { rating: "average", color: "yellow" };
  }
  return { rating: "poor", color: "red" };
};

export const generateBenchmarkReport = (
  benchmarks: Benchmark[],
  currentMetrics: PerformanceMetric[]
): {
  overallScore: number;
  categoryScores: Record<BenchmarkCategory, number>;
  improvements: PerformanceMetric[];
  trends: Record<string, "improving" | "declining" | "stable">;
} => {
  const categoryScores: Record<BenchmarkCategory, number> = {
    yield: 0,
    cost: 0,
    quality: 0,
    efficiency: 0,
    sustainability: 0,
    labor: 0,
  };

  const categoryMetrics: Record<BenchmarkCategory, PerformanceMetric[]> = {
    yield: [],
    cost: [],
    quality: [],
    efficiency: [],
    sustainability: [],
    labor: [],
  };

  currentMetrics.forEach((metric) => {
    categoryMetrics[metric.category].push(metric);
  });

  Object.keys(categoryScores).forEach((category) => {
    const metrics = categoryMetrics[category as BenchmarkCategory];
    categoryScores[category as BenchmarkCategory] = calculateKPIScore(metrics);
  });

  const overallScore = calculateKPIScore(currentMetrics);
  const improvements = identifyImprovementAreas(currentMetrics);

  const trends: Record<string, "improving" | "declining" | "stable"> = {};
  currentMetrics.forEach((metric) => {
    trends[metric.name] = "stable";
  });

  return {
    overallScore,
    categoryScores,
    improvements,
    trends,
  };
};

