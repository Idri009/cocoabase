import { type Address } from 'viem';

export interface RiskAssessment {
  id: bigint;
  owner: Address;
  plantationId: bigint;
  riskType: 'weather' | 'market' | 'disease' | 'financial';
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  assessmentDate: bigint;
  mitigationPlan: string;
  txHash: string;
}

export function createRiskAssessment(
  owner: Address,
  plantationId: bigint,
  riskType: RiskAssessment['riskType'],
  riskLevel: RiskAssessment['riskLevel'],
  mitigationPlan: string
): RiskAssessment {
  return {
    id: BigInt(Date.now()),
    owner,
    plantationId,
    riskType,
    riskLevel,
    assessmentDate: BigInt(Date.now()),
    mitigationPlan,
    txHash: '',
  };
}

export function getHighRiskAssessments(
  assessments: RiskAssessment[]
): RiskAssessment[] {
  return assessments.filter((a) => a.riskLevel === 'high' || a.riskLevel === 'critical');
}

export function getAssessmentsByType(
  assessments: RiskAssessment[],
  riskType: RiskAssessment['riskType']
): RiskAssessment[] {
  return assessments.filter((a) => a.riskType === riskType);
}

export function getRecentAssessments(
  assessments: RiskAssessment[],
  days: number
): RiskAssessment[] {
  const cutoff = BigInt(Date.now() - days * 24 * 60 * 60 * 1000);
  return assessments.filter((a) => a.assessmentDate >= cutoff);
}
