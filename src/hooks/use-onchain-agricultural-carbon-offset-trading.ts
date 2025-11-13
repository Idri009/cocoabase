import { useState } from 'react';
import { useAccount } from 'wagmi';
import {
  createCarbonOffset,
  type CarbonOffset,
} from '@/lib/onchain-agricultural-carbon-offset-trading-utils';

export function useOnchainAgriculturalCarbonOffsetTrading() {
  const { address } = useAccount();
  const [offsets, setOffsets] = useState<CarbonOffset[]>([]);

  const create = async (
    amount: bigint,
    price: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    const offset = createCarbonOffset(address, amount, price);
    setOffsets([...offsets, offset]);
  };

  return { offsets, create, address };
}
