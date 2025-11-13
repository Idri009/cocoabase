import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createYieldPrediction,
  type YieldPrediction,
} from '@/lib/onchain-farm-yield-prediction-utils';

/**
 * Hook for onchain farm yield prediction
 * Uses Reown wallet for all transactions
 */
export function useOnchainFarmYieldPrediction() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [predictions, setPredictions] = useState<YieldPrediction[]>([]);

  const predict = async (
    plantationId: string,
    expectedYield: bigint,
    confidence: number
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    const prediction = createYieldPrediction(address, plantationId, expectedYield, confidence);
    setPredictions([...predictions, prediction]);
  };

  const recordActualYield = async (
    contractAddress: Address,
    predictionId: string,
    actualYield: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    await writeContract({
      address: contractAddress,
      abi: [],
      functionName: 'recordActualYield',
      args: [predictionId, actualYield],
    });
  };

  return { predictions, predict, recordActualYield, address };
}

