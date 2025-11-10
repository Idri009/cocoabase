import { useState } from 'react';
import { useAccount } from 'wagmi';
import {
  createYieldPrediction,
  type YieldPrediction,
} from '@/lib/onchain-crop-yield-prediction-model-utils';

export function useOnchainCropYieldPredictionModel() {
  const { address } = useAccount();
  const [predictions, setPredictions] = useState<YieldPrediction[]>([]);

  const createPrediction = async (
    plantationId: bigint,
    predictedYield: bigint,
    confidence: number,
    modelVersion: string
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected');
    const prediction = createYieldPrediction(address, plantationId, predictedYield, confidence, modelVersion);
    setPredictions([...predictions, prediction]);
  };

  return { predictions, createPrediction, address };
}
