import { useState } from 'react';
import { useAccount } from 'wagmi';
import {
  createValuation,
  type InventoryValuation,
} from '@/lib/onchain-farm-inventory-valuation-utils';

export function useOnchainFarmInventoryValuation() {
  const { address } = useAccount();
  const [valuations, setValuations] = useState<InventoryValuation[]>([]);

  const create = async (
    itemId: bigint,
    quantity: bigint,
    unitPrice: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected');
    const valuation = createValuation(address, itemId, quantity, unitPrice);
    setValuations([...valuations, valuation]);
  };

  return { valuations, create, address };
}
