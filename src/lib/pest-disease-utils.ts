export type PestDiseaseType = "pest" | "disease" | "weed";

export type Severity = "low" | "medium" | "high" | "critical";

export type TreatmentStatus = "identified" | "treated" | "monitoring" | "resolved";

export interface PestDiseaseRecord {
  id: string;
  plantationId: string;
  type: PestDiseaseType;
  name: string;
  severity: Severity;
  status: TreatmentStatus;
  detectedDate: Date;
  treatedDate?: Date;
  resolvedDate?: Date;
  treatment?: string;
  affectedArea: number;
  notes?: string;
  images?: string[];
}

export const calculateAffectedPercentage = (
  affectedArea: number,
  totalArea: number
): number => {
  if (totalArea === 0) return 0;
  return (affectedArea / totalArea) * 100;
};

export const isCritical = (record: PestDiseaseRecord): boolean => {
  return record.severity === "critical" || record.status === "identified";
};

export const needsImmediateAttention = (record: PestDiseaseRecord): boolean => {
  return (
    isCritical(record) ||
    (record.severity === "high" && record.status === "identified")
  );
};

export const getTreatmentRecommendations = (
  type: PestDiseaseType,
  severity: Severity
): string[] => {
  const recommendations: string[] = [];

  if (type === "pest") {
    if (severity === "critical" || severity === "high") {
      recommendations.push("Apply appropriate pesticide immediately");
      recommendations.push("Isolate affected area if possible");
    } else {
      recommendations.push("Monitor closely and apply preventive measures");
      recommendations.push("Consider biological control methods");
    }
  } else if (type === "disease") {
    if (severity === "critical" || severity === "high") {
      recommendations.push("Apply fungicide or appropriate treatment");
      recommendations.push("Remove and destroy severely affected plants");
    } else {
      recommendations.push("Improve air circulation and drainage");
      recommendations.push("Apply preventive fungicide");
    }
  } else if (type === "weed") {
    recommendations.push("Manual removal for small areas");
    recommendations.push("Apply herbicide if area is large");
    recommendations.push("Consider mulching to prevent regrowth");
  }

  return recommendations;
};

export const getRecordsByStatus = (
  records: PestDiseaseRecord[]
): Record<TreatmentStatus, PestDiseaseRecord[]> => {
  return records.reduce(
    (acc, record) => {
      if (!acc[record.status]) {
        acc[record.status] = [];
      }
      acc[record.status].push(record);
      return acc;
    },
    {} as Record<TreatmentStatus, PestDiseaseRecord[]>
  );
};

export const getRecordsByType = (
  records: PestDiseaseRecord[]
): Record<PestDiseaseType, PestDiseaseRecord[]> => {
  return records.reduce(
    (acc, record) => {
      if (!acc[record.type]) {
        acc[record.type] = [];
      }
      acc[record.type].push(record);
      return acc;
    },
    {} as Record<PestDiseaseType, PestDiseaseRecord[]>
  );
};

export const getUrgentRecords = (records: PestDiseaseRecord[]): PestDiseaseRecord[] => {
  return records.filter(needsImmediateAttention);
};

export const calculateTreatmentSuccessRate = (
  records: PestDiseaseRecord[]
): number => {
  const treated = records.filter((r) => r.status === "resolved" || r.status === "treated");
  return records.length > 0 ? (treated.length / records.length) * 100 : 0;
};

export const getAverageResolutionTime = (
  records: PestDiseaseRecord[]
): number | null => {
  const resolved = records.filter((r) => r.resolvedDate);
  if (resolved.length === 0) return null;

  const totalDays = resolved.reduce((sum, record) => {
    if (!record.detectedDate || !record.resolvedDate) return sum;
    const diff = record.resolvedDate.getTime() - record.detectedDate.getTime();
    return sum + Math.floor(diff / (1000 * 60 * 60 * 24));
  }, 0);

  return totalDays / resolved.length;
};

