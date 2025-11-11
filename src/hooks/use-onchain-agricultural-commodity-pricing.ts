import { useState } from 'react';
import { useAccount } from 'wagmi';
import {
  updateCommodityPrice,
  type CommodityPrice,
} from '@/lib/onchain-agricultural-commodity-pricing-utils';

export function useOnchainAgriculturalCommodityPricing() {
  const { address } = useAccount();
  const [prices, setPrices] = useState<CommodityPrice[]>([]);

  const update = async (
    commodity: string,
    price: bigint,
    unit: string,
    market: string
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected');
    const priceUpdate = updateCommodityPrice(address, commodity, price, unit, market);
    setPrices([...prices, priceUpdate]);
  };

  return { prices, update, address };
}
