import { type Address } from 'viem';

/**
 * Onchain farm crop harvest blockchain multisig utilities
 * Multisig proposal creation on blockchain
 */

export interface MultisigProposal {
  id: string;
  harvestId: string;
  createdBy: Address;
  signers: Address[];
  threshold: number;
  proposalDate: bigint;
  action: string;
  signatures: Address[];
  executed: boolean;
  timestamp: bigint;
}

export function createMultisigProposal(
  address: Address,
  harvestId: string,
  signers: Address[],
  threshold: number,
  proposalDate: bigint,
  action: string
): MultisigProposal {
  return {
    id: `${Date.now()}-${Math.random()}`,
    harvestId,
    createdBy: address,
    signers,
    threshold,
    proposalDate,
    action,
    signatures: [],
    executed: false,
    timestamp: BigInt(Date.now()),
  };
}

