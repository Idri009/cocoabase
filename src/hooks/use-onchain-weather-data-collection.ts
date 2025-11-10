import { useState } from 'react';
import { useAccount } from 'wagmi';
import {
  recordWeatherData,
  type WeatherData,
} from '@/lib/onchain-weather-data-collection-utils';

export function useOnchainWeatherDataCollection() {
  const { address } = useAccount();
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);

  const record = async (
    plantationId: bigint,
    temperature: number,
    humidity: number,
    rainfall: number,
    windSpeed: number
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected');
    const data = recordWeatherData(address, plantationId, temperature, humidity, rainfall, windSpeed);
    setWeatherData([...weatherData, data]);
  };

  return { weatherData, record, address };
}
