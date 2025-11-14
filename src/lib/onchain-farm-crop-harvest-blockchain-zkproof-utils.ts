import { type Address } from 'viem';

/**
 * Onchain farm crop harvest blockchain zero-knowledge proof utilities
 * ZK proof creation on blockchain
 */

export interface ZKProof {
  id: string;
  harvestId: string;
  generatedBy: Address;
  proofType: string;
  proofData: string;
  publicInputs: string[];
  proofDate: bigint;
  verified: boolean;
  timestamp: bigint;
}

export function createZKProof(
  address: Address,
  harvestId: string,
  proofType: string,
  proofData: string,
  publicInputs: string[],
  proofDate: bigint
): ZKProof {
  return {
    id: `${Date.now()}-${Math.random()}`,
    harvestId,
    generatedBy: address,
    proofType,
    proofData,
    publicInputs,
    proofDate,
    verified: false,
    timestamp: BigInt(Date.now()),
  };
}

