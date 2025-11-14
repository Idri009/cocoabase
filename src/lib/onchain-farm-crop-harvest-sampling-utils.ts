import { type Address } from 'viem';

/**
 * Onchain farm crop harvest sampling utilities
 * Sample creation and verification
 */

export interface HarvestSample {
  id: string;
  harvestId: string;
  sampledBy: Address;
  sampleType: string;
  sampleSize: bigint;
  samplingDate: bigint;
  location: string;
  verified: boolean;
  timestamp: bigint;
}

export function createSample(
  address: Address,
  harvestId: string,
  sampleType: string,
  sampleSize: bigint,
  samplingDate: bigint,
  location: string
): HarvestSample {
  return {
    id: `${Date.now()}-${Math.random()}`,
    harvestId,
    sampledBy: address,
    sampleType,
    sampleSize,
    samplingDate,
    location,
    verified: false,
    timestamp: BigInt(Date.now()),
  };
}

