import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createMultisigProposal,
  type MultisigProposal,
} from '@/lib/onchain-farm-crop-harvest-blockchain-multisig-utils';

/**
 * Hook for onchain farm crop harvest blockchain multisig
 * Uses blockchain wallet for all web3 transactions
 */
export function useOnchainFarmCropHarvestBlockchainMultisig() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [proposals, setProposals] = useState<MultisigProposal[]>([]);

  const createProposal = async (
    harvestId: string,
    signers: Address[],
    threshold: number,
    proposalDate: bigint,
    action: string
  ): Promise<void> => {
    if (!address) throw new Error('Web3 wallet not connected');
    const proposal = createMultisigProposal(address, harvestId, signers, threshold, proposalDate, action);
    setProposals([...proposals, proposal]);
  };

  const signProposal = async (
    contractAddress: Address,
    proposalId: string
  ): Promise<void> => {
    if (!address) throw new Error('Web3 wallet not connected');
    await writeContract({
      address: contractAddress,
      abi: [],
      functionName: 'signProposal',
      args: [proposalId],
    });
  };

  return { proposals, createProposal, signProposal, address };
}

