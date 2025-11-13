import { type Address } from 'viem';

/**
 * Onchain farm weather insurance utilities
 * Weather insurance policies and claims management
 */

export interface WeatherInsurance {
  id: string;
  plantationId: string;
  owner: Address;
  coverageAmount: bigint;
  premium: bigint;
  startDate: bigint;
  endDate: bigint;
  status: 'active' | 'claimed' | 'expired';
}

export function createWeatherInsurance(
  address: Address,
  plantationId: string,
  coverageAmount: bigint,
  premium: bigint
): WeatherInsurance {
  const startDate = BigInt(Date.now());
  const endDate = BigInt(Date.now() + 365 * 24 * 60 * 60 * 1000); // 1 year
  return {
    id: `${Date.now()}-${Math.random()}`,
    plantationId,
    owner: address,
    coverageAmount,
    premium,
    startDate,
    endDate,
    status: 'active',
  };
}

