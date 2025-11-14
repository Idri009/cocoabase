import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createBatchProcess,
  type BatchProcess,
} from '@/lib/onchain-farm-crop-harvest-batch-processing-utils';

/**
 * Hook for onchain farm crop harvest batch processing
 * Uses blockchain wallet for all web3 transactions
 */
export function useOnchainFarmCropHarvestBatchProcessing() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [processes, setProcesses] = useState<BatchProcess[]>([]);

  const createProcess = async (
    harvestId: string,
    processType: string,
    inputQuantity: bigint,
    outputQuantity: bigint,
    processDate: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Web3 wallet not connected');
    const process = createBatchProcess(address, harvestId, processType, inputQuantity, outputQuantity, processDate);
    setProcesses([...processes, process]);
  };

  const completeProcess = async (
    contractAddress: Address,
    processId: string
  ): Promise<void> => {
    if (!address) throw new Error('Web3 wallet not connected');
    await writeContract({
      address: contractAddress,
      abi: [],
      functionName: 'completeProcess',
      args: [processId],
    });
  };

  return { processes, createProcess, completeProcess, address };
}

