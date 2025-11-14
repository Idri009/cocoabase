import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createWeatherRecord,
  type WeatherRecord,
} from '@/lib/onchain-farm-weather-monitoring-utils';

export function useOnchainFarmWeatherMonitoring() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [records, setRecords] = useState<WeatherRecord[]>([]);

  const recordWeather = async (
    contractAddress: Address,
    plantationId: bigint,
    temperature: bigint,
    humidity: bigint,
    rainfall: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    
    const record = createWeatherRecord(address, plantationId, temperature, humidity, rainfall);
    
    await writeContract({
      address: contractAddress,
      abi: [
        {
          inputs: [
            { name: 'plantationId', type: 'uint256' },
            { name: 'temperature', type: 'uint256' },
            { name: 'humidity', type: 'uint256' },
            { name: 'rainfall', type: 'uint256' }
          ],
          name: 'recordWeather',
          outputs: [{ name: '', type: 'uint256' }],
          stateMutability: 'nonpayable',
          type: 'function'
        }
      ],
      functionName: 'recordWeather',
      args: [plantationId, temperature, humidity, rainfall],
    });
    
    setRecords([...records, record]);
  };

  return { records, recordWeather, address };
}


