import { type Address } from 'viem';

/**
 * Onchain farm sustainability rewards utilities
 * Sustainability reward calculation and distribution
 */

export interface SustainabilityReward {
  id: string;
  plantationId: string;
  recipient: Address;
  sustainabilityScore: number;
  rewardAmount: bigint;
  distributed: boolean;
  timestamp: bigint;
}

export function createReward(
  address: Address,
  plantationId: string,
  sustainabilityScore: number,
  rewardAmount: bigint
): SustainabilityReward {
  return {
    id: `${Date.now()}-${Math.random()}`,
    plantationId,
    recipient: address,
    sustainabilityScore,
    rewardAmount,
    distributed: false,
    timestamp: BigInt(Date.now()),
  };
}

