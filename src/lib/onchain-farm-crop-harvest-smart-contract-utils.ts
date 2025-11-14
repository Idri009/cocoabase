import { type Address } from 'viem';

/**
 * Onchain farm crop harvest smart contract utilities
 * Smart contract record creation on blockchain
 */

export interface SmartContractRecord {
  id: string;
  harvestId: string;
  createdBy: Address;
  contractAddress: Address;
  contractType: string;
  deploymentDate: bigint;
  contractHash: string;
  timestamp: bigint;
}

export function createSmartContractRecord(
  address: Address,
  harvestId: string,
  contractAddress: Address,
  contractType: string,
  deploymentDate: bigint,
  contractHash: string
): SmartContractRecord {
  return {
    id: `${Date.now()}-${Math.random()}`,
    harvestId,
    createdBy: address,
    contractAddress,
    contractType,
    deploymentDate,
    contractHash,
    timestamp: BigInt(Date.now()),
  };
}

