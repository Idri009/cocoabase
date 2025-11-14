import { type Address } from 'viem';

/**
 * Onchain farm livestock milk production utilities
 * Milk production record creation on blockchain
 */

export interface MilkProductionRecord {
  id: string;
  animalId: string;
  recordedBy: Address;
  quantity: bigint;
  qualityGrade: string;
  productionDate: bigint;
  milkingTime: string;
  timestamp: bigint;
}

export function createMilkProductionRecord(
  address: Address,
  animalId: string,
  quantity: bigint,
  qualityGrade: string,
  productionDate: bigint,
  milkingTime: string
): MilkProductionRecord {
  return {
    id: `${Date.now()}-${Math.random()}`,
    animalId,
    recordedBy: address,
    quantity,
    qualityGrade,
    productionDate,
    milkingTime,
    timestamp: BigInt(Date.now()),
  };
}

