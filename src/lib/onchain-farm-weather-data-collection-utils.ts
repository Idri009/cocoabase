import { type Address } from 'viem';

/**
 * Onchain farm weather data collection utilities
 * Weather data recording and verification
 */

export interface WeatherData {
  id: string;
  plantationId: string;
  recordedBy: Address;
  temperature: number;
  humidity: number;
  rainfall: bigint;
  windSpeed: number;
  date: bigint;
  verified: boolean;
  timestamp: bigint;
}

export function createWeatherData(
  address: Address,
  plantationId: string,
  temperature: number,
  humidity: number,
  rainfall: bigint,
  windSpeed: number,
  date: bigint
): WeatherData {
  return {
    id: `${Date.now()}-${Math.random()}`,
    plantationId,
    recordedBy: address,
    temperature,
    humidity,
    rainfall,
    windSpeed,
    date,
    verified: false,
    timestamp: BigInt(Date.now()),
  };
}

