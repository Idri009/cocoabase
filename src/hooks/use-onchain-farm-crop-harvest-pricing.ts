import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createPricingRecord,
  type PricingRecord,
} from '@/lib/onchain-farm-crop-harvest-pricing-utils';

/**
 * Hook for onchain farm crop harvest pricing
 * Uses blockchain wallet for all web3 transactions
 */
export function useOnchainFarmCropHarvestPricing() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [records, setRecords] = useState<PricingRecord[]>([]);

  const setPrice = async (
    harvestId: string,
    price: bigint,
    currency: string,
    pricingDate: bigint,
    market: string
  ): Promise<void> => {
    if (!address) throw new Error('Web3 wallet not connected');
    const record = createPricingRecord(address, harvestId, price, currency, pricingDate, market);
    setRecords([...records, record]);
  };

  const updatePrice = async (
    contractAddress: Address,
    recordId: string,
    newPrice: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Web3 wallet not connected');
    await writeContract({
      address: contractAddress,
      abi: [],
      functionName: 'updatePrice',
      args: [recordId, newPrice],
    });
  };

  return { records, setPrice, updatePrice, address };
}

