import { type Address } from 'viem';

/**
 * Onchain farm livestock blockchain bridge utilities
 * Bridge record creation on blockchain
 */

export interface BridgeRecord {
  id: string;
  animalId: string;
  bridgedBy: Address;
  sourceChain: string;
  targetChain: string;
  bridgeDate: bigint;
  bridgeAmount: bigint;
  completed: boolean;
  timestamp: bigint;
}

export function createBridgeRecord(
  address: Address,
  animalId: string,
  sourceChain: string,
  targetChain: string,
  bridgeDate: bigint,
  bridgeAmount: bigint
): BridgeRecord {
  return {
    id: `${Date.now()}-${Math.random()}`,
    animalId,
    bridgedBy: address,
    sourceChain,
    targetChain,
    bridgeDate,
    bridgeAmount,
    completed: false,
    timestamp: BigInt(Date.now()),
  };
}



