import { useState } from 'react';
import { useAccount } from 'wagmi';
import {
  createYieldForecast,
  type YieldForecast,
} from '@/lib/onchain-crop-yield-forecasting-utils';

export function useOnchainCropYieldForecasting() {
  const { address } = useAccount();
  const [forecasts, setForecasts] = useState<YieldForecast[]>([]);

  const createForecast = async (
    plantationId: bigint,
    predictedYield: bigint,
    confidence: number
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected');
    const forecast = createYieldForecast(address, plantationId, predictedYield, confidence);
    setForecasts([...forecasts, forecast]);
  };

  return { forecasts, createForecast, address };
}
