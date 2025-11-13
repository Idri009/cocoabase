import { type Address } from 'viem';

/**
 * Onchain farm water source management utilities
 * Water source registration and quality management
 */

export interface WaterSource {
  id: string;
  sourceType: string;
  owner: Address;
  location: string;
  capacity: bigint;
  quality: string;
  timestamp: bigint;
}

export function createWaterSource(
  address: Address,
  sourceType: string,
  location: string,
  capacity: bigint,
  quality: string
): WaterSource {
  return {
    id: `${Date.now()}-${Math.random()}`,
    sourceType,
    owner: address,
    location,
    capacity,
    quality,
    timestamp: BigInt(Date.now()),
  };
}

