import { useState } from 'react';
import { useAccount } from 'wagmi';
import {
  createRiskAssessment,
  type RiskAssessment,
} from '@/lib/onchain-farm-risk-assessment-system-utils';

export function useOnchainFarmRiskAssessmentSystem() {
  const { address } = useAccount();
  const [assessments, setAssessments] = useState<RiskAssessment[]>([]);

  const create = async (
    plantationId: bigint,
    riskType: RiskAssessment['riskType'],
    riskLevel: RiskAssessment['riskLevel'],
    mitigationPlan: string
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected');
    const assessment = createRiskAssessment(address, plantationId, riskType, riskLevel, mitigationPlan);
    setAssessments([...assessments, assessment]);
  };

  return { assessments, create, address };
}
