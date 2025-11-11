import { type Address } from 'viem';

export interface WeatherRiskInsurance {
  id: bigint;
  owner: Address;
  plantationId: bigint;
  coverageType: string;
  coverageAmount: bigint;
  premium: bigint;
  startDate: bigint;
  endDate: bigint;
  status: 'active' | 'expired' | 'claimed';
  txHash: string;
}

export function createWeatherInsurance(
  owner: Address,
  plantationId: bigint,
  coverageType: string,
  coverageAmount: bigint,
  premium: bigint,
  endDate: bigint
): WeatherRiskInsurance {
  return {
    id: BigInt(Date.now()),
    owner,
    plantationId,
    coverageType,
    coverageAmount,
    premium,
    startDate: BigInt(Date.now()),
    endDate,
    status: 'active',
    txHash: '',
  };
}
