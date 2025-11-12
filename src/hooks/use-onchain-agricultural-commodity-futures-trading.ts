import { useState } from 'react';
import { useAccount } from 'wagmi';
import {
  createFuture,
  type CommodityFuture,
} from '@/lib/onchain-agricultural-commodity-futures-trading-utils';

export function useOnchainAgriculturalCommodityFuturesTrading() {
  const { address } = useAccount();
  const [futures, setFutures] = useState<CommodityFuture[]>([]);

  const create = async (
    commodity: string,
    quantity: bigint,
    price: bigint,
    expiryDate: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected');
    const future = createFuture(address, commodity, quantity, price, expiryDate);
    setFutures([...futures, future]);
  };

  return { futures, create, address };
}
