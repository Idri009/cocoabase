import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createProposal,
  type Proposal,
} from '@/lib/onchain-farm-cooperative-voting-utils';

export function useOnchainFarmCooperativeVoting() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [proposals, setProposals] = useState<Proposal[]>([]);

  const createProposalAction = async (
    contractAddress: Address,
    description: string,
    votingDuration: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    
    const proposal = createProposal(address, description, votingDuration);
    
    await writeContract({
      address: contractAddress,
      abi: [
        {
          inputs: [
            { name: 'description', type: 'string' },
            { name: 'votingDuration', type: 'uint256' }
          ],
          name: 'createProposal',
          outputs: [{ name: '', type: 'uint256' }],
          stateMutability: 'nonpayable',
          type: 'function'
        }
      ],
      functionName: 'createProposal',
      args: [description, votingDuration],
    });
    
    setProposals([...proposals, proposal]);
  };

  const vote = async (
    contractAddress: Address,
    proposalId: bigint,
    support: boolean
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    
    await writeContract({
      address: contractAddress,
      abi: [
        {
          inputs: [
            { name: 'proposalId', type: 'uint256' },
            { name: 'support', type: 'bool' }
          ],
          name: 'vote',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function'
        }
      ],
      functionName: 'vote',
      args: [proposalId, support],
    });
  };

  return { proposals, createProposalAction, vote, address };
}
