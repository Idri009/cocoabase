import { useState } from 'react';
import { useAccount } from 'wagmi';
import type { Address } from 'viem';
import {
  updatePrice,
  getLatestPrice,
  getPricesByMarket,
  getPriceHistory,
  type CommodityPrice,
} from '@/lib/onchain-agricultural-commodity-pricing-utils';

export function useOnchainAgriculturalCommodityPricing() {
  const { address } = useAccount();
  const [prices, setPrices] = useState<CommodityPrice[]>([]);

  const update = (commodity: string, price: bigint, market: string) => {
    if (!address) throw new Error('Wallet not connected via Reown');
    const priceUpdate = updatePrice(address, commodity, price, market);
    setPrices((prev) => [...prev, priceUpdate]);
    console.log('Updating price:', { commodity, price, market });
  };

  return {
    prices,
    update,
    getLatestPrice,
    getPricesByMarket,
    getPriceHistory,
    address,
  };
}
