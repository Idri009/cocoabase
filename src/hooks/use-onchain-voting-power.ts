import { useState } from 'react';
import { useAccount } from 'wagmi';
import type { Address } from 'viem';
import {
  createVotingPower,
  delegateVotingPower,
  calculateTotalVotingPower,
  type VotingPower,
} from '@/lib/onchain-voting-power-utils';

export function useOnchainVotingPower() {
  const { address } = useAccount();
  const [powers, setPowers] = useState<VotingPower[]>([]);

  const delegate = (to: Address, snapshot: bigint) => {
    if (!address) throw new Error('Wallet not connected via Reown');
    const fromPower = powers.find((p) => p.address === address && p.snapshot === snapshot);
    if (!fromPower) throw new Error('Voting power not found');
    const result = delegateVotingPower(fromPower, to);
    setPowers((prev) =>
      prev.map((p) =>
        p.address === address ? result.from : p.address === to ? result.to : p
      )
    );
    console.log('Delegating voting power:', result);
  };

  return {
    powers,
    delegate,
    calculateTotalVotingPower,
    address,
  };
}

