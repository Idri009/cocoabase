import { type Address } from 'viem';

/**
 * Onchain farm livestock environmental monitoring utilities
 * Environmental reading creation and verification
 */

export interface EnvironmentalReading {
  id: string;
  location: string;
  recordedBy: Address;
  temperature: number;
  humidity: number;
  airQuality: number;
  readingDate: bigint;
  verified: boolean;
  timestamp: bigint;
}

export function createEnvironmentalReading(
  address: Address,
  location: string,
  temperature: number,
  humidity: number,
  airQuality: number,
  readingDate: bigint
): EnvironmentalReading {
  return {
    id: `${Date.now()}-${Math.random()}`,
    location,
    recordedBy: address,
    temperature,
    humidity,
    airQuality,
    readingDate,
    verified: false,
    timestamp: BigInt(Date.now()),
  };
}

