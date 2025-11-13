import { type Address } from 'viem';

export interface SustainabilityScore {
  id: string;
  scoreId: bigint;
  farmOwner: Address;
  environmentalScore: bigint;
  socialScore: bigint;
  economicScore: bigint;
  overallScore: bigint;
  date: bigint;
  verified: boolean;
}

export function createSustainabilityScore(
  farmOwner: Address,
  scoreId: bigint,
  environmentalScore: bigint,
  socialScore: bigint,
  economicScore: bigint
): SustainabilityScore {
  const overallScore = (environmentalScore + socialScore + economicScore) / BigInt(3);

  return {
    id: `${Date.now()}-${Math.random()}`,
    scoreId,
    farmOwner,
    environmentalScore,
    socialScore,
    economicScore,
    overallScore,
    date: BigInt(Date.now()),
    verified: false,
  };
}
