export type ComplianceType = 
  | "certification"
  | "regulatory"
  | "environmental"
  | "labor"
  | "safety"
  | "quality";

export type ComplianceStatus = "compliant" | "non-compliant" | "pending-review" | "expired";

export interface ComplianceRequirement {
  id: string;
  type: ComplianceType;
  name: string;
  description: string;
  requirement: string;
  dueDate: Date;
  status: ComplianceStatus;
  lastReviewDate?: Date;
  nextReviewDate?: Date;
  documents?: string[];
  notes?: string;
}

export const calculateComplianceRate = (
  requirements: ComplianceRequirement[]
): number => {
  if (requirements.length === 0) return 100;
  const compliant = requirements.filter((r) => r.status === "compliant").length;
  return (compliant / requirements.length) * 100;
};

export const getComplianceByType = (
  requirements: ComplianceRequirement[]
): Record<ComplianceType, ComplianceRequirement[]> => {
  return requirements.reduce(
    (acc, req) => {
      if (!acc[req.type]) {
        acc[req.type] = [];
      }
      acc[req.type].push(req);
      return acc;
    },
    {
      certification: [],
      regulatory: [],
      environmental: [],
      labor: [],
      safety: [],
      quality: [],
    } as Record<ComplianceType, ComplianceRequirement[]>
  );
};

export const getUpcomingComplianceDeadlines = (
  requirements: ComplianceRequirement[],
  daysAhead: number = 30
): ComplianceRequirement[] => {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() + daysAhead);

  return requirements.filter((req) => {
    if (req.status === "compliant") return false;
    return req.dueDate <= cutoffDate && req.dueDate >= new Date();
  });
};

export const getOverdueCompliance = (
  requirements: ComplianceRequirement[]
): ComplianceRequirement[] => {
  const now = new Date();
  return requirements.filter((req) => {
    return req.status !== "compliant" && req.dueDate < now;
  });
};

export const isComplianceDue = (requirement: ComplianceRequirement): boolean => {
  return requirement.dueDate <= new Date() && requirement.status !== "compliant";
};

export const getDaysUntilDue = (requirement: ComplianceRequirement): number => {
  const now = new Date();
  const diff = requirement.dueDate.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

export const markCompliant = (
  requirement: ComplianceRequirement,
  reviewDate?: Date
): ComplianceRequirement => {
  return {
    ...requirement,
    status: "compliant",
    lastReviewDate: reviewDate || new Date(),
  };
};

export const getComplianceSummary = (requirements: ComplianceRequirement[]): {
  total: number;
  compliant: number;
  nonCompliant: number;
  pending: number;
  expired: number;
  complianceRate: number;
  byType: Record<ComplianceType, number>;
  upcoming: number;
  overdue: number;
} => {
  const byType = getComplianceByType(requirements);

  return {
    total: requirements.length,
    compliant: requirements.filter((r) => r.status === "compliant").length,
    nonCompliant: requirements.filter((r) => r.status === "non-compliant").length,
    pending: requirements.filter((r) => r.status === "pending-review").length,
    expired: requirements.filter((r) => r.status === "expired").length,
    complianceRate: calculateComplianceRate(requirements),
    byType: {
      certification: byType.certification.length,
      regulatory: byType.regulatory.length,
      environmental: byType.environmental.length,
      labor: byType.labor.length,
      safety: byType.safety.length,
      quality: byType.quality.length,
    },
    upcoming: getUpcomingComplianceDeadlines(requirements).length,
    overdue: getOverdueCompliance(requirements).length,
  };
};

export const formatComplianceType = (type: ComplianceType): string => {
  const labels: Record<ComplianceType, string> = {
    certification: "Certification",
    regulatory: "Regulatory",
    environmental: "Environmental",
    labor: "Labor",
    safety: "Safety",
    quality: "Quality",
  };
  return labels[type];
};

