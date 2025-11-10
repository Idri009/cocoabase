import { useState } from 'react';
import { useAccount } from 'wagmi';
import type { Address } from 'viem';
import {
  createPriceStabilizer,
  stabilizePrice,
  calculatePriceDeviation,
  type PriceStabilizer,
} from '@/lib/onchain-price-stabilizer-utils';

export function useOnchainPriceStabilizer() {
  const { address } = useAccount();
  const [stabilizers, setStabilizers] = useState<PriceStabilizer[]>([]);

  const stabilize = (stabilizerId: bigint, newPrice: bigint) => {
    const stabilizer = stabilizers.find((s) => s.id === stabilizerId);
    if (!stabilizer) throw new Error('Stabilizer not found');
    const result = stabilizePrice(stabilizer, newPrice);
    setStabilizers((prev) =>
      prev.map((s) => (s.id === stabilizerId ? result.stabilizer : s))
    );
    console.log('Stabilizing price:', result);
  };

  return {
    stabilizers,
    stabilize,
    calculatePriceDeviation,
    address,
  };
}
