import { useState } from 'react';
import { useAccount } from 'wagmi';
import type { Address } from 'viem';
import {
  createTimeWeightedPosition,
  calculateTimeWeightedAverage,
  type TimeWeightedPosition,
} from '@/lib/onchain-time-weighted-utils';

export function useOnchainTimeWeighted() {
  const { address } = useAccount();
  const [positions, setPositions] = useState<TimeWeightedPosition[]>([]);

  const addPosition = (amount: bigint) => {
    if (!address) throw new Error('Wallet not connected via Reown');
    const entryTime = BigInt(Date.now());
    const position = createTimeWeightedPosition(address, amount, entryTime);
    setPositions((prev) => [...prev, position]);
    console.log('Adding time-weighted position:', position);
  };

  return {
    positions,
    addPosition,
    calculateTimeWeightedAverage,
    address,
  };
}

