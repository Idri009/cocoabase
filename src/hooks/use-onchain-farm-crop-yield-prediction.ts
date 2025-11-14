import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createYieldPrediction,
  type YieldPrediction,
} from '@/lib/onchain-farm-crop-yield-prediction-utils';

/**
 * Hook for onchain crop yield prediction
 * Uses Reown wallet for all transactions
 */
export function useOnchainFarmCropYieldPrediction() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [predictions, setPredictions] = useState<YieldPrediction[]>([]);

  const createPrediction = async (
    contractAddress: Address,
    plantationId: bigint,
    predictedYield: bigint,
    confidence: bigint,
    cropType: string
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    
    const prediction = createYieldPrediction(
      address,
      plantationId,
      predictedYield,
      confidence,
      cropType
    );
    
    await writeContract({
      address: contractAddress,
      abi: [
        {
          inputs: [
            { name: 'plantationId', type: 'uint256' },
            { name: 'predictedYield', type: 'uint256' },
            { name: 'confidence', type: 'uint256' },
            { name: 'cropType', type: 'string' }
          ],
          name: 'createPrediction',
          outputs: [{ name: '', type: 'uint256' }],
          stateMutability: 'nonpayable',
          type: 'function'
        }
      ],
      functionName: 'createPrediction',
      args: [plantationId, predictedYield, confidence, cropType],
    });
    
    setPredictions([...predictions, prediction]);
  };

  const verifyPrediction = async (
    contractAddress: Address,
    predictionId: bigint,
    actualYield: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    
    await writeContract({
      address: contractAddress,
      abi: [
        {
          inputs: [
            { name: 'predictionId', type: 'uint256' },
            { name: 'actualYield', type: 'uint256' }
          ],
          name: 'verifyPrediction',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function'
        }
      ],
      functionName: 'verifyPrediction',
      args: [predictionId, actualYield],
    });
  };

  return { 
    predictions, 
    createPrediction, 
    verifyPrediction, 
    address 
  };
}

