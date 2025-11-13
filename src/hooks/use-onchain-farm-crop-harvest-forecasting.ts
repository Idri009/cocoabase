import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createForecast,
  type HarvestForecast,
} from '@/lib/onchain-farm-crop-harvest-forecasting-utils';

/**
 * Hook for onchain farm crop harvest forecasting
 * Uses Reown wallet for all transactions
 */
export function useOnchainFarmCropHarvestForecasting() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [forecasts, setForecasts] = useState<HarvestForecast[]>([]);

  const createForecast = async (
    plantationId: string,
    predictedYield: bigint,
    forecastDate: bigint,
    confidence: number,
    factors: string[]
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    const forecast = createForecast(address, plantationId, predictedYield, forecastDate, confidence, factors);
    setForecasts([...forecasts, forecast]);
  };

  const updateForecast = async (
    contractAddress: Address,
    forecastId: string,
    newPredictedYield: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    await writeContract({
      address: contractAddress,
      abi: [],
      functionName: 'updateForecast',
      args: [forecastId, newPredictedYield],
    });
  };

  return { forecasts, createForecast, updateForecast, address };
}

