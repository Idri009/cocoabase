import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  type GovernanceProposal,
} from '@/lib/onchain-governance-utils';

export function useOnchainGovernance() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [proposals, setProposals] = useState<GovernanceProposal[]>([]);

  const createProposal = async (
    description: string
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    await writeContract({
      address: '0x0000000000000000000000000000000000000000' as Address,
      abi: [],
      functionName: 'createProposal',
      args: [description],
    });
  };

  return { proposals, createProposal, address };
}
