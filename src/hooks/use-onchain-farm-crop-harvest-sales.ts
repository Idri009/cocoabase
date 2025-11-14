import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createSale,
  type HarvestSale,
} from '@/lib/onchain-farm-crop-harvest-sales-utils';

/**
 * Hook for onchain farm crop harvest sales
 * Uses Reown wallet for all transactions
 */
export function useOnchainFarmCropHarvestSales() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [sales, setSales] = useState<HarvestSale[]>([]);

  const createSale = async (
    harvestId: string,
    buyer: Address,
    quantity: bigint,
    price: bigint,
    saleDate: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    const sale = createSale(address, harvestId, buyer, quantity, price, saleDate);
    setSales([...sales, sale]);
  };

  const confirmSale = async (
    contractAddress: Address,
    saleId: string
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    await writeContract({
      address: contractAddress,
      abi: [],
      functionName: 'confirmSale',
      args: [saleId],
    });
  };

  return { sales, createSale, confirmSale, address };
}

