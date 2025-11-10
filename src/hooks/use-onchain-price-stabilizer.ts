import { useState } from 'react';
import { useAccount } from 'wagmi';
import type { Address } from 'viem';
import {
  createPriceStabilizer,
  stabilizePrice,
  isPriceStable,
  calculatePriceDeviation,
  type PriceStabilizer,
} from '@/lib/onchain-price-stabilizer-utils';

export function useOnchainPriceStabilizer() {
  const { address } = useAccount();
  const [stabilizers, setStabilizers] = useState<PriceStabilizer[]>([]);

  const stabilize = (stabilizerId: bigint, newPrice: bigint) => {
    const stabilizer = stabilizers.find((s) => s.id === stabilizerId);
    if (!stabilizer) throw new Error('Stabilizer not found');
    const updated = stabilizePrice(stabilizer, newPrice);
    setStabilizers((prev) =>
      prev.map((s) => (s.id === stabilizerId ? updated : s))
    );
    console.log('Stabilizing price:', updated);
  };

  return {
    stabilizers,
    stabilize,
    isPriceStable,
    calculatePriceDeviation,
    address,
  };
}

