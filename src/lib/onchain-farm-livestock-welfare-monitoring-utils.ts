import { type Address } from 'viem';

export interface WelfareAssessment {
  id: string;
  livestockId: bigint;
  healthScore: bigint;
  behaviorScore: bigint;
  environmentScore: bigint;
  nutritionScore: bigint;
  overallScore: bigint;
  assessor: Address;
}

export function createWelfareAssessment(
  address: Address,
  livestockId: bigint,
  healthScore: bigint,
  behaviorScore: bigint,
  environmentScore: bigint,
  nutritionScore: bigint
): WelfareAssessment {
  const overallScore = (healthScore + behaviorScore + environmentScore + nutritionScore) / 4n;
  return {
    id: `${Date.now()}-${Math.random()}`,
    livestockId,
    healthScore,
    behaviorScore,
    environmentScore,
    nutritionScore,
    overallScore,
    assessor: address,
  };
}
