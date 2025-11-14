import { type Address } from 'viem';

/**
 * Onchain farm crop harvest blockchain pausable utilities
 * Pause record creation on blockchain
 */

export interface PauseRecord {
  id: string;
  harvestId: string;
  pausedBy: Address;
  pauseReason: string;
  pauseDate: bigint;
  unpaused: boolean;
  timestamp: bigint;
}

export function createPauseRecord(
  address: Address,
  harvestId: string,
  pauseReason: string,
  pauseDate: bigint
): PauseRecord {
  return {
    id: `${Date.now()}-${Math.random()}`,
    harvestId,
    pausedBy: address,
    pauseReason,
    pauseDate,
    unpaused: false,
    timestamp: BigInt(Date.now()),
  };
}

