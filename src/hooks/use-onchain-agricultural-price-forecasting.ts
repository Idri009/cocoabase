import { useState } from 'react';
import { useAccount } from 'wagmi';
import {
  createPriceForecast,
  type PriceForecast,
} from '@/lib/onchain-agricultural-price-forecasting-utils';

export function useOnchainAgriculturalPriceForecasting() {
  const { address } = useAccount();
  const [forecasts, setForecasts] = useState<PriceForecast[]>([]);

  const create = async (
    commodity: string,
    predictedPrice: bigint,
    confidence: number
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    const forecast = createPriceForecast(address, commodity, predictedPrice, confidence);
    setForecasts([...forecasts, forecast]);
  };

  return { forecasts, create, address };
}
