import { type Address } from 'viem';

/**
 * Onchain farm soil nutrient management utilities
 * Nutrient management plan creation and application
 */

export interface NutrientManagementPlan {
  id: string;
  plantationId: string;
  createdBy: Address;
  nitrogen: bigint;
  phosphorus: bigint;
  potassium: bigint;
  applicationDate: bigint;
  applied: boolean;
  timestamp: bigint;
}

export function createNutrientPlan(
  address: Address,
  plantationId: string,
  nitrogen: bigint,
  phosphorus: bigint,
  potassium: bigint,
  applicationDate: bigint
): NutrientManagementPlan {
  return {
    id: `${Date.now()}-${Math.random()}`,
    plantationId,
    createdBy: address,
    nitrogen,
    phosphorus,
    potassium,
    applicationDate,
    applied: false,
    timestamp: BigInt(Date.now()),
  };
}

