import { type Address } from 'viem';

/**
 * Onchain farm yield tracking utilities
 * Yield tracking system
 */

export interface YieldRecord {
  id: string;
  recordId: bigint;
  farmer: Address;
  cropId: bigint;
  cropType: string;
  fieldId: bigint;
  harvestDate: bigint;
  yieldAmount: bigint;
  area: bigint;
  yieldPerHectare: bigint;
  location: string;
  quality: string;
}

export function createYieldRecord(
  address: Address,
  cropId: bigint,
  cropType: string,
  fieldId: bigint,
  harvestDate: bigint,
  yieldAmount: bigint,
  area: bigint,
  location: string,
  quality: string
): YieldRecord {
  const yieldPerHectare = (yieldAmount * BigInt(10000)) / area;

  return {
    id: `${Date.now()}-${Math.random()}`,
    recordId: BigInt(0),
    farmer: address,
    cropId,
    cropType,
    fieldId,
    harvestDate,
    yieldAmount,
    area,
    yieldPerHectare,
    location,
    quality,
  };
}

