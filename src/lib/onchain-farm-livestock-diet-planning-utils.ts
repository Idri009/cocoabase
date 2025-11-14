import { type Address } from 'viem';

/**
 * Onchain farm livestock diet planning utilities
 * Diet plan creation and updates
 */

export interface DietPlan {
  id: string;
  animalId: string;
  createdBy: Address;
  feedComponents: string[];
  dailyAmount: bigint;
  startDate: bigint;
  duration: number;
  timestamp: bigint;
}

export function createDietPlan(
  address: Address,
  animalId: string,
  feedComponents: string[],
  dailyAmount: bigint,
  startDate: bigint,
  duration: number
): DietPlan {
  return {
    id: `${Date.now()}-${Math.random()}`,
    animalId,
    createdBy: address,
    feedComponents,
    dailyAmount,
    startDate,
    duration,
    timestamp: BigInt(Date.now()),
  };
}

