import { useState } from 'react';
import { useAccount } from 'wagmi';
import type { Address } from 'viem';
import {
  createRiskAssessment,
  getHighRisk,
  getAssessmentsByType,
  getRecentAssessments,
  type RiskAssessment,
} from '@/lib/onchain-farm-risk-assessment-system-utils';

export function useOnchainFarmRiskAssessmentSystem() {
  const { address } = useAccount();
  const [assessments, setAssessments] = useState<RiskAssessment[]>([]);

  const assess = (
    riskType: 'weather' | 'market' | 'disease' | 'financial',
    level: 'low' | 'medium' | 'high' | 'critical'
  ) => {
    if (!address) throw new Error('Wallet not connected via Reown');
    const assessment = createRiskAssessment(address, riskType, level);
    setAssessments((prev) => [...prev, assessment]);
    console.log('Creating risk assessment:', { riskType, level });
  };

  return {
    assessments,
    assess,
    getHighRisk,
    getAssessmentsByType,
    getRecentAssessments,
    address,
  };
}
