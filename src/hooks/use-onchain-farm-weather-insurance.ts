import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createWeatherInsurance,
  type WeatherInsurance,
} from '@/lib/onchain-farm-weather-insurance-utils';

/**
 * Hook for onchain farm weather insurance
 * Uses Reown wallet for all transactions
 */
export function useOnchainFarmWeatherInsurance() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [policies, setPolicies] = useState<WeatherInsurance[]>([]);

  const purchasePolicy = async (
    plantationId: string,
    coverageAmount: bigint,
    premium: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    const policy = createWeatherInsurance(address, plantationId, coverageAmount, premium);
    setPolicies([...policies, policy]);
  };

  const fileClaim = async (
    contractAddress: Address,
    policyId: string,
    weatherEvent: string,
    damageAmount: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    await writeContract({
      address: contractAddress,
      abi: [],
      functionName: 'fileClaim',
      args: [policyId, weatherEvent, damageAmount],
    });
  };

  return { policies, purchasePolicy, fileClaim, address };
}

