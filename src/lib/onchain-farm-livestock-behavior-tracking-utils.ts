import { type Address } from 'viem';

/**
 * Onchain farm livestock behavior tracking utilities
 * Behavior record creation and verification
 */

export interface BehaviorRecord {
  id: string;
  animalId: string;
  recordedBy: Address;
  behaviorType: string;
  observation: string;
  observationDate: bigint;
  verified: boolean;
  timestamp: bigint;
}

export function createBehaviorRecord(
  address: Address,
  animalId: string,
  behaviorType: string,
  observation: string,
  observationDate: bigint
): BehaviorRecord {
  return {
    id: `${Date.now()}-${Math.random()}`,
    animalId,
    recordedBy: address,
    behaviorType,
    observation,
    observationDate,
    verified: false,
    timestamp: BigInt(Date.now()),
  };
}

