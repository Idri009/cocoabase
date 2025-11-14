import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createReturnRecord,
  type ReturnRecord,
} from '@/lib/onchain-farm-crop-harvest-return-processing-utils';

/**
 * Hook for onchain farm crop harvest return processing
 * Uses blockchain wallet for all web3 transactions
 */
export function useOnchainFarmCropHarvestReturnProcessing() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [records, setRecords] = useState<ReturnRecord[]>([]);

  const processReturn = async (
    harvestId: string,
    returnReason: string,
    returnQuantity: bigint,
    returnDate: bigint,
    returnedBy: Address
  ): Promise<void> => {
    if (!address) throw new Error('Web3 wallet not connected');
    const record = createReturnRecord(address, harvestId, returnReason, returnQuantity, returnDate, returnedBy);
    setRecords([...records, record]);
  };

  const approveReturn = async (
    contractAddress: Address,
    recordId: string
  ): Promise<void> => {
    if (!address) throw new Error('Web3 wallet not connected');
    await writeContract({
      address: contractAddress,
      abi: [],
      functionName: 'approveReturn',
      args: [recordId],
    });
  };

  return { records, processReturn, approveReturn, address };
}

