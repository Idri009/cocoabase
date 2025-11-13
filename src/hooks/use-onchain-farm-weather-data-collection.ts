import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createWeatherData,
  type WeatherData,
} from '@/lib/onchain-farm-weather-data-collection-utils';

/**
 * Hook for onchain farm weather data collection
 * Uses Reown wallet for all transactions
 */
export function useOnchainFarmWeatherDataCollection() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [dataRecords, setDataRecords] = useState<WeatherData[]>([]);

  const recordWeatherData = async (
    plantationId: string,
    temperature: number,
    humidity: number,
    rainfall: bigint,
    windSpeed: number,
    date: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    const data = createWeatherData(address, plantationId, temperature, humidity, rainfall, windSpeed, date);
    setDataRecords([...dataRecords, data]);
  };

  const verifyData = async (
    contractAddress: Address,
    dataId: string
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    await writeContract({
      address: contractAddress,
      abi: [],
      functionName: 'verifyData',
      args: [dataId],
    });
  };

  return { dataRecords, recordWeatherData, verifyData, address };
}

