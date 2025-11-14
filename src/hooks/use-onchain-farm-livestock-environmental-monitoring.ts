import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createEnvironmentalReading,
  type EnvironmentalReading,
} from '@/lib/onchain-farm-livestock-environmental-monitoring-utils';

/**
 * Hook for onchain farm livestock environmental monitoring
 * Uses Reown wallet for all transactions
 */
export function useOnchainFarmLivestockEnvironmentalMonitoring() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [readings, setReadings] = useState<EnvironmentalReading[]>([]);

  const recordReading = async (
    location: string,
    temperature: number,
    humidity: number,
    airQuality: number,
    readingDate: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    const reading = createEnvironmentalReading(address, location, temperature, humidity, airQuality, readingDate);
    setReadings([...readings, reading]);
  };

  const verifyReading = async (
    contractAddress: Address,
    readingId: string
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    await writeContract({
      address: contractAddress,
      abi: [],
      functionName: 'verifyReading',
      args: [readingId],
    });
  };

  return { readings, recordReading, verifyReading, address };
}

