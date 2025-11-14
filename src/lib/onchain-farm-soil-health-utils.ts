import { type Address } from 'viem';

/**
 * Onchain farm soil health utilities
 * Soil health monitoring and tracking
 */

export interface SoilHealthRecord {
  id: string;
  recordId: bigint;
  farmer: Address;
  location: string;
  timestamp: bigint;
  phLevel: bigint;
  nitrogenLevel: bigint;
  phosphorusLevel: bigint;
  potassiumLevel: bigint;
  organicMatter: bigint;
  soilType: string;
  healthStatus: string;
}

export function createSoilHealthRecord(
  address: Address,
  location: string,
  phLevel: bigint,
  nitrogenLevel: bigint,
  phosphorusLevel: bigint,
  potassiumLevel: bigint,
  organicMatter: bigint,
  soilType: string,
  healthStatus: string
): SoilHealthRecord {
  return {
    id: `${Date.now()}-${Math.random()}`,
    recordId: BigInt(0),
    farmer: address,
    location,
    timestamp: BigInt(Date.now()),
    phLevel,
    nitrogenLevel,
    phosphorusLevel,
    potassiumLevel,
    organicMatter,
    soilType,
    healthStatus,
  };
}

