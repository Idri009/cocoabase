import { type Address } from 'viem';

export interface WeatherDerivative {
  id: bigint;
  owner: Address;
  plantationId: bigint;
  weatherType: 'rainfall' | 'temperature' | 'humidity';
  threshold: bigint;
  payout: bigint;
  expiresAt: bigint;
  txHash: string;
}

export function createWeatherDerivative(
  owner: Address,
  plantationId: bigint,
  weatherType: WeatherDerivative['weatherType'],
  threshold: bigint,
  payout: bigint,
  expiresAt: bigint
): WeatherDerivative {
  return {
    id: BigInt(Date.now()),
    owner,
    plantationId,
    weatherType,
    threshold,
    payout,
    expiresAt,
    txHash: '',
  };
}

export function isDerivativeExpired(
  derivative: WeatherDerivative,
  currentTime: bigint
): boolean {
  return currentTime > derivative.expiresAt;
}

export function calculatePayout(
  derivative: WeatherDerivative,
  actualValue: bigint
): bigint {
  if (actualValue >= derivative.threshold) {
    return derivative.payout;
  }
  return BigInt(0);
}
