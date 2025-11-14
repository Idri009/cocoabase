import { type Address } from 'viem';

/**
 * Onchain farm crop harvest batch processing utilities
 * Batch process creation on blockchain
 */

export interface BatchProcess {
  id: string;
  harvestId: string;
  createdBy: Address;
  processType: string;
  inputQuantity: bigint;
  outputQuantity: bigint;
  processDate: bigint;
  completed: boolean;
  timestamp: bigint;
}

export function createBatchProcess(
  address: Address,
  harvestId: string,
  processType: string,
  inputQuantity: bigint,
  outputQuantity: bigint,
  processDate: bigint
): BatchProcess {
  return {
    id: `${Date.now()}-${Math.random()}`,
    harvestId,
    createdBy: address,
    processType,
    inputQuantity,
    outputQuantity,
    processDate,
    completed: false,
    timestamp: BigInt(Date.now()),
  };
}

