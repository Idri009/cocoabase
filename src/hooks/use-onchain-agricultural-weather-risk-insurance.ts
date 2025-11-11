import { useState } from 'react';
import { useAccount } from 'wagmi';
import {
  createWeatherInsurance,
  type WeatherRiskInsurance,
} from '@/lib/onchain-agricultural-weather-risk-insurance-utils';

export function useOnchainAgriculturalWeatherRiskInsurance() {
  const { address } = useAccount();
  const [policies, setPolicies] = useState<WeatherRiskInsurance[]>([]);

  const create = async (
    plantationId: bigint,
    coverageType: string,
    coverageAmount: bigint,
    premium: bigint,
    endDate: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected');
    const insurance = createWeatherInsurance(address, plantationId, coverageType, coverageAmount, premium, endDate);
    setPolicies([...policies, insurance]);
  };

  return { policies, create, address };
}
