import { useState } from 'react';
import { useAccount } from 'wagmi';
import type { Address } from 'viem';
import {
  createSnapshot,
  getBalanceAtSnapshot,
  calculateVotingPower,
  type Snapshot,
} from '@/lib/onchain-snapshot-utils';

export function useOnchainSnapshot() {
  const { address } = useAccount();
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);

  const takeSnapshot = (
    blockNumber: bigint,
    balances: Map<Address, bigint>,
    totalSupply: bigint
  ) => {
    const snapshot = createSnapshot(blockNumber, balances, totalSupply);
    setSnapshots((prev) => [...prev, snapshot]);
    console.log('Taking snapshot:', snapshot);
  };

  return {
    snapshots,
    takeSnapshot,
    getBalanceAtSnapshot,
    calculateVotingPower,
    address,
  };
}

