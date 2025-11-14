import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createMilkProductionRecord,
  type MilkProductionRecord,
} from '@/lib/onchain-farm-livestock-milk-production-utils';

/**
 * Hook for onchain farm livestock milk production
 * Uses blockchain wallet for all web3 transactions
 */
export function useOnchainFarmLivestockMilkProduction() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [records, setRecords] = useState<MilkProductionRecord[]>([]);

  const recordProduction = async (
    animalId: string,
    quantity: bigint,
    qualityGrade: string,
    productionDate: bigint,
    milkingTime: string
  ): Promise<void> => {
    if (!address) throw new Error('Web3 wallet not connected');
    const record = createMilkProductionRecord(address, animalId, quantity, qualityGrade, productionDate, milkingTime);
    setRecords([...records, record]);
  };

  const updateProduction = async (
    contractAddress: Address,
    recordId: string,
    newQuantity: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Web3 wallet not connected');
    await writeContract({
      address: contractAddress,
      abi: [],
      functionName: 'updateProduction',
      args: [recordId, newQuantity],
    });
  };

  return { records, recordProduction, updateProduction, address };
}

