import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createInventoryRecord,
  type InventoryRecord,
} from '@/lib/onchain-farm-crop-harvest-inventory-utils';

/**
 * Hook for onchain farm crop harvest inventory
 * Uses blockchain wallet for all web3 transactions
 */
export function useOnchainFarmCropHarvestInventory() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [records, setRecords] = useState<InventoryRecord[]>([]);

  const recordInventory = async (
    harvestId: string,
    quantity: bigint,
    location: string,
    recordDate: bigint,
    status: string
  ): Promise<void> => {
    if (!address) throw new Error('Web3 wallet not connected');
    const record = createInventoryRecord(address, harvestId, quantity, location, recordDate, status);
    setRecords([...records, record]);
  };

  const updateInventory = async (
    contractAddress: Address,
    recordId: string,
    newQuantity: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Web3 wallet not connected');
    await writeContract({
      address: contractAddress,
      abi: [],
      functionName: 'updateInventory',
      args: [recordId, newQuantity],
    });
  };

  return { records, recordInventory, updateInventory, address };
}

