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

  const update = (commodity: string, market: string, price: bigint) => {
    if (!address) throw new Error('Wallet not connected via Reown');
    const commodityPrice = updatePrice(address, commodity, market, price);
    setPrices((prev) => [...prev, commodityPrice]);
    console.log('Updating price:', { commodity, market, price });
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
