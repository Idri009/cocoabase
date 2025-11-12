import { type Address } from 'viem';

export interface RiskAssessment {
  id: bigint;
  assessor: Address;
  riskType: 'weather' | 'market' | 'disease' | 'financial';
  level: 'low' | 'medium' | 'high' | 'critical';
  timestamp: bigint;
}

export function createRiskAssessment(
  assessor: Address,
  riskType: 'weather' | 'market' | 'disease' | 'financial',
  level: 'low' | 'medium' | 'high' | 'critical'
): RiskAssessment {
  return {
    id: BigInt(0),
    assessor,
    riskType,
    level,
    timestamp: BigInt(Date.now()),
  };
}

export function getHighRisk(
  assessments: RiskAssessment[]
): RiskAssessment[] {
  return assessments.filter((a) => a.level === 'high' || a.level === 'critical');
}

export function getAssessmentsByType(
  assessments: RiskAssessment[],
  riskType: 'weather' | 'market' | 'disease' | 'financial'
): RiskAssessment[] {
  return assessments.filter((a) => a.riskType === riskType);
}

export function getRecentAssessments(
  assessments: RiskAssessment[],
  days: number
): RiskAssessment[] {
  const cutoff = BigInt(Date.now() - days * 24 * 60 * 60 * 1000);
  return assessments.filter((a) => a.timestamp >= cutoff);
}
