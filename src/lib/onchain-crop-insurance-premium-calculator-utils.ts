import { type Address } from 'viem';

export interface PremiumCalculation {
  id: bigint;
  plantationId: bigint;
  coverage: bigint;
  rate: number;
  premium: bigint;
  timestamp: bigint;
}

export function calculatePremium(
  plantationId: bigint,
  coverage: bigint,
  rate: number
): PremiumCalculation {
  const premium = (coverage * BigInt(Math.floor(rate * 100))) / BigInt(10000);
  return {
    id: BigInt(0),
    plantationId,
    coverage,
    rate,
    premium,
    timestamp: BigInt(Date.now()),
  };
}
