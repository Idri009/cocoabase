import { useState } from 'react';
import { useAccount } from 'wagmi';
import type { Address } from 'viem';
import {
  createSupplyChainItem,
  advanceStage,
  type SupplyChainItem,
} from '@/lib/onchain-supply-chain-tracking-utils';

export function useOnchainSupplyChainTracking() {
  const { address } = useAccount();
  const [items, setItems] = useState<SupplyChainItem[]>([]);

  const createItem = async (
    plantationId: bigint,
    stage: SupplyChainItem['stage'],
    location: string
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected');
    const item = createSupplyChainItem(address, plantationId, stage, location);
    setItems([...items, item]);
  };

  return { items, createItem, address };
}
