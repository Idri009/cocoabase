import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createProductivityRecord,
  type ProductivityRecord,
} from '@/lib/onchain-farm-labor-productivity-utils';

/**
 * Hook for onchain farm labor productivity tracking
 * Uses Reown wallet for all transactions
 */
export function useOnchainFarmLaborProductivity() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [records, setRecords] = useState<ProductivityRecord[]>([]);

  const recordProductivity = async (
    worker: Address,
    task: string,
    output: bigint,
    hoursWorked: number
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    const record = createProductivityRecord(address, worker, task, output, hoursWorked);
    setRecords([...records, record]);
  };

  const calculateEfficiency = async (
    contractAddress: Address,
    recordId: string
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    await writeContract({
      address: contractAddress,
      abi: [],
      functionName: 'calculateEfficiency',
      args: [recordId],
    });
  };

  return { records, recordProductivity, calculateEfficiency, address };
}

