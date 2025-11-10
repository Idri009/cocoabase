import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createProposal,
  voteOnProposal,
  executeProposal,
  calculateVoteMargin,
  type GovernanceProposal,
} from '@/lib/onchain-governance-utils';

export function useOnchainGovernance() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [proposals, setProposals] = useState<GovernanceProposal[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [isVoting, setIsVoting] = useState(false);

  const createNewProposal = async (
    title: string,
    description: string,
    duration: bigint,
    executionData?: string
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected');
    setIsCreating(true);
    try {
      const proposal = createProposal(
        address,
        title,
        description,
        duration,
        executionData
      );
      console.log('Creating proposal:', proposal);
    } finally {
      setIsCreating(false);
    }
  };

  const vote = async (
    proposalId: bigint,
    support: boolean,
    weight: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected');
    setIsVoting(true);
    try {
      const currentTime = BigInt(Date.now());
      const proposal = proposals.find((p) => p.id === proposalId);
      if (!proposal) throw new Error('Proposal not found');
      const updated = voteOnProposal(proposal, address, support, weight, currentTime);
      if (updated) {
        console.log('Voting on proposal:', { proposalId, support, address });
      }
    } finally {
      setIsVoting(false);
    }
  };

  return {
    proposals,
    createNewProposal,
    vote,
    executeProposal,
    calculateVoteMargin,
    isCreating,
    isVoting,
    address,
  };
}
