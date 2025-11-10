import { useState } from 'react';
import { useAccount } from 'wagmi';
import {
  updatePrice,
  type PriceOracle,
} from '@/lib/onchain-price-oracles-utils';

export function useOnchainPriceOracles() {
  const { address } = useAccount();
  const [oracles, setOracles] = useState<PriceOracle[]>([]);

  const updateCommodityPrice = async (
    commodity: string,
    price: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected');
    const oracle = updatePrice(address, commodity, price);
    setOracles([...oracles, oracle]);
  };

  return { oracles, updateCommodityPrice, address };
}
