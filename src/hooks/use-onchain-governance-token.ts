import { useState } from 'react';
import { useAccount } from 'wagmi';
import type { Address } from 'viem';
import {
  createGovernanceToken,
  assignVotingPower,
  getVotingPower,
  calculateVotingPercentage,
  type GovernanceToken,
} from '@/lib/onchain-governance-token-utils';

export function useOnchainGovernanceToken() {
  const { address } = useAccount();
  const [tokens, setTokens] = useState<GovernanceToken[]>([]);

  const assignPower = (
    tokenId: bigint,
    holder: Address,
    amount: bigint
  ) => {
    const token = tokens.find((t) => t.id === tokenId);
    if (!token) throw new Error('Token not found');
    const updated = assignVotingPower(token, holder, amount);
    setTokens((prev) => prev.map((t) => (t.id === tokenId ? updated : t)));
    console.log('Assigning voting power:', { tokenId, holder, amount });
  };

  return {
    tokens,
    assignPower,
    getVotingPower,
    calculateVotingPercentage,
    address,
  };
}

