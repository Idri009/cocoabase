import { type Address } from 'viem';

/**
 * Onchain farm livestock blockchain checkpoint utilities
 * Checkpoint creation on blockchain
 */

export interface Checkpoint {
  id: string;
  animalId: string;
  createdBy: Address;
  checkpointHash: string;
  checkpointDate: bigint;
  state: string;
  verified: boolean;
  timestamp: bigint;
}

export function createCheckpoint(
  address: Address,
  animalId: string,
  checkpointHash: string,
  checkpointDate: bigint,
  state: string
): Checkpoint {
  return {
    id: `${Date.now()}-${Math.random()}`,
    animalId,
    createdBy: address,
    checkpointHash,
    checkpointDate,
    state,
    verified: false,
    timestamp: BigInt(Date.now()),
  };
}




