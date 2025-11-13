import { type Address } from 'viem';

/**
 * Onchain farm crop harvest processing utilities
 * Processing record creation and verification
 */

export interface HarvestProcessing {
  id: string;
  harvestId: string;
  recordedBy: Address;
  processingType: string;
  inputAmount: bigint;
  outputAmount: bigint;
  processingDate: bigint;
  verified: boolean;
  timestamp: bigint;
}

export function createProcessingRecord(
  address: Address,
  harvestId: string,
  processingType: string,
  inputAmount: bigint,
  outputAmount: bigint,
  processingDate: bigint
): HarvestProcessing {
  return {
    id: `${Date.now()}-${Math.random()}`,
    harvestId,
    recordedBy: address,
    processingType,
    inputAmount,
    outputAmount,
    processingDate,
    verified: false,
    timestamp: BigInt(Date.now()),
  };
}

