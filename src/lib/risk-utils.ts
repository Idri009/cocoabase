export type RiskCategory = 
  | "weather"
  | "pest-disease"
  | "market"
  | "financial"
  | "operational"
  | "compliance"
  | "equipment"
  | "labor";

export type RiskLevel = "low" | "medium" | "high" | "critical";

export type RiskStatus = "identified" | "assessed" | "mitigated" | "monitoring" | "resolved";

export interface Risk {
  id: string;
  category: RiskCategory;
  title: string;
  description: string;
  level: RiskLevel;
  status: RiskStatus;
  probability: number;
  impact: number;
  identifiedDate: Date;
  mitigationPlan?: string;
  mitigationDate?: Date;
  responsible?: string;
  notes?: string;
}

export const calculateRiskScore = (probability: number, impact: number): number => {
  return probability * impact;
};

export const determineRiskLevel = (score: number): RiskLevel => {
  if (score >= 80) return "critical";
  if (score >= 60) return "high";
  if (score >= 40) return "medium";
  return "low";
};

export const assessRisk = (
  probability: number,
  impact: number
): { score: number; level: RiskLevel } => {
  const score = calculateRiskScore(probability, impact);
  const level = determineRiskLevel(score);
  return { score, level };
};

export const getRisksByLevel = (
  risks: Risk[]
): Record<RiskLevel, Risk[]> => {
  return risks.reduce(
    (acc, risk) => {
      if (!acc[risk.level]) {
        acc[risk.level] = [];
      }
      acc[risk.level].push(risk);
      return acc;
    },
    {} as Record<RiskLevel, Risk[]>
  );
};

export const getRisksByCategory = (
  risks: Risk[]
): Record<RiskCategory, Risk[]> => {
  return risks.reduce(
    (acc, risk) => {
      if (!acc[risk.category]) {
        acc[risk.category] = [];
      }
      acc[risk.category].push(risk);
      return acc;
    },
    {} as Record<RiskCategory, Risk[]>
  );
};

export const getCriticalRisks = (risks: Risk[]): Risk[] => {
  return risks.filter((r) => r.level === "critical" || r.level === "high");
};

export const getUnmitigatedRisks = (risks: Risk[]): Risk[] => {
  return risks.filter(
    (r) => r.status === "identified" || r.status === "assessed"
  );
};

export const calculateRiskExposure = (risks: Risk[]): number => {
  if (risks.length === 0) return 0;
  const totalScore = risks.reduce(
    (sum, risk) => sum + calculateRiskScore(risk.probability, risk.impact),
    0
  );
  return totalScore / risks.length;
};

export const getRiskTrend = (
  risks: Risk[]
): "increasing" | "decreasing" | "stable" => {
  if (risks.length < 2) return "stable";

  const recent = risks.slice(-10);
  const older = risks.slice(0, Math.max(0, risks.length - 10));

  if (older.length === 0) return "stable";

  const recentAvg = calculateRiskExposure(recent);
  const olderAvg = calculateRiskExposure(older);

  const diff = recentAvg - olderAvg;
  if (diff > 10) return "increasing";
  if (diff < -10) return "decreasing";
  return "stable";
};

export const generateMitigationRecommendations = (
  risk: Risk
): string[] => {
  const recommendations: string[] = [];

  switch (risk.category) {
    case "weather":
      recommendations.push("Monitor weather forecasts regularly");
      recommendations.push("Implement protective measures (shade, irrigation)");
      recommendations.push("Consider crop insurance");
      break;
    case "pest-disease":
      recommendations.push("Implement integrated pest management");
      recommendations.push("Regular monitoring and early detection");
      recommendations.push("Maintain proper sanitation practices");
      break;
    case "market":
      recommendations.push("Diversify market channels");
      recommendations.push("Consider forward contracts");
      recommendations.push("Monitor price trends");
      break;
    case "financial":
      recommendations.push("Maintain emergency fund");
      recommendations.push("Diversify income sources");
      recommendations.push("Monitor cash flow closely");
      break;
    case "operational":
      recommendations.push("Develop contingency plans");
      recommendations.push("Cross-train staff");
      recommendations.push("Maintain backup systems");
      break;
    case "compliance":
      recommendations.push("Stay updated on regulations");
      recommendations.push("Maintain proper documentation");
      recommendations.push("Regular compliance audits");
      break;
    case "equipment":
      recommendations.push("Regular maintenance schedule");
      recommendations.push("Keep spare parts inventory");
      recommendations.push("Equipment insurance");
      break;
    case "labor":
      recommendations.push("Cross-train workers");
      recommendations.push("Maintain good working conditions");
      recommendations.push("Competitive compensation");
      break;
  }

  return recommendations;
};

export const getRiskSummary = (risks: Risk[]): {
  total: number;
  byLevel: Record<RiskLevel, number>;
  byCategory: Record<RiskCategory, number>;
  byStatus: Record<RiskStatus, number>;
  averageExposure: number;
  criticalCount: number;
  unmitigatedCount: number;
} => {
  const byLevel = getRisksByLevel(risks);
  const byCategory = getRisksByCategory(risks);
  const byStatus = risks.reduce(
    (acc, risk) => {
      if (!acc[risk.status]) {
        acc[risk.status] = 0;
      }
      acc[risk.status]++;
      return acc;
    },
    {} as Record<RiskStatus, number>
  );

  return {
    total: risks.length,
    byLevel: {
      low: byLevel.low?.length || 0,
      medium: byLevel.medium?.length || 0,
      high: byLevel.high?.length || 0,
      critical: byLevel.critical?.length || 0,
    },
    byCategory: {
      weather: byCategory.weather?.length || 0,
      "pest-disease": byCategory["pest-disease"]?.length || 0,
      market: byCategory.market?.length || 0,
      financial: byCategory.financial?.length || 0,
      operational: byCategory.operational?.length || 0,
      compliance: byCategory.compliance?.length || 0,
      equipment: byCategory.equipment?.length || 0,
      labor: byCategory.labor?.length || 0,
    },
    byStatus: {
      identified: byStatus.identified || 0,
      assessed: byStatus.assessed || 0,
      mitigated: byStatus.mitigated || 0,
      monitoring: byStatus.monitoring || 0,
      resolved: byStatus.resolved || 0,
    },
    averageExposure: calculateRiskExposure(risks),
    criticalCount: getCriticalRisks(risks).length,
    unmitigatedCount: getUnmitigatedRisks(risks).length,
  };
};

