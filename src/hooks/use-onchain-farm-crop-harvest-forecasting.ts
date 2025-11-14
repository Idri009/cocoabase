import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createHarvestForecast,
  type HarvestForecast,
} from '@/lib/onchain-farm-crop-harvest-forecasting-utils';

export function useOnchainFarmCropHarvestForecasting() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [harvestForecasts, setHarvestForecasts] = useState<HarvestForecast[]>([]);

  const createForecast = async (
    contractAddress: Address,
    plantationId: bigint,
    cropType: string,
    predictedHarvestDate: bigint,
    predictedYield: bigint,
    confidenceLevel: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    
    const forecast = createHarvestForecast(
      address,
      plantationId,
      cropType,
      predictedHarvestDate,
      predictedYield,
      confidenceLevel
    );
    
    await writeContract({
      address: contractAddress,
      abi: [
        {
          inputs: [
            { name: 'plantationId', type: 'uint256' },
            { name: 'cropType', type: 'string' },
            { name: 'predictedHarvestDate', type: 'uint256' },
            { name: 'predictedYield', type: 'uint256' },
            { name: 'confidenceLevel', type: 'uint256' }
          ],
          name: 'createHarvestForecast',
          outputs: [{ name: '', type: 'uint256' }],
          stateMutability: 'nonpayable',
          type: 'function'
        }
      ],
      functionName: 'createHarvestForecast',
      args: [plantationId, cropType, predictedHarvestDate, predictedYield, confidenceLevel],
    });
    
    setHarvestForecasts([...harvestForecasts, forecast]);
  };

  const validateForecast = async (
    contractAddress: Address,
    forecastId: bigint,
    actualHarvestDate: bigint,
    actualYield: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    
    await writeContract({
      address: contractAddress,
      abi: [
        {
          inputs: [
            { name: 'forecastId', type: 'uint256' },
            { name: 'actualHarvestDate', type: 'uint256' },
            { name: 'actualYield', type: 'uint256' }
          ],
          name: 'validateForecast',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function'
        }
      ],
      functionName: 'validateForecast',
      args: [forecastId, actualHarvestDate, actualYield],
    });
  };

  return { 
    harvestForecasts, 
    createForecast, 
    validateForecast, 
    address 
  };
}
