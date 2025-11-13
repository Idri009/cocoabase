import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createProcessingRecord,
  type HarvestProcessing,
} from '@/lib/onchain-farm-crop-harvest-processing-utils';

/**
 * Hook for onchain farm crop harvest processing
 * Uses Reown wallet for all transactions
 */
export function useOnchainFarmCropHarvestProcessing() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [processings, setProcessings] = useState<HarvestProcessing[]>([]);

  const recordProcessing = async (
    harvestId: string,
    processingType: string,
    inputAmount: bigint,
    outputAmount: bigint,
    processingDate: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    const processing = createProcessingRecord(address, harvestId, processingType, inputAmount, outputAmount, processingDate);
    setProcessings([...processings, processing]);
  };

  const verifyProcessing = async (
    contractAddress: Address,
    processingId: string
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    await writeContract({
      address: contractAddress,
      abi: [],
      functionName: 'verifyProcessing',
      args: [processingId],
    });
  };

  return { processings, recordProcessing, verifyProcessing, address };
}

