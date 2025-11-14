import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createShippingRecord,
  type ShippingRecord,
} from '@/lib/onchain-farm-crop-harvest-shipping-utils';

/**
 * Hook for onchain farm crop harvest shipping
 * Uses blockchain wallet for all web3 transactions
 */
export function useOnchainFarmCropHarvestShipping() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [records, setRecords] = useState<ShippingRecord[]>([]);

  const createShipping = async (
    harvestId: string,
    carrier: string,
    trackingNumber: string,
    destination: string,
    shippingDate: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Web3 wallet not connected');
    const record = createShippingRecord(address, harvestId, carrier, trackingNumber, destination, shippingDate);
    setRecords([...records, record]);
  };

  const confirmDelivery = async (
    contractAddress: Address,
    recordId: string
  ): Promise<void> => {
    if (!address) throw new Error('Web3 wallet not connected');
    await writeContract({
      address: contractAddress,
      abi: [],
      functionName: 'confirmDelivery',
      args: [recordId],
    });
  };

  return { records, createShipping, confirmDelivery, address };
}

