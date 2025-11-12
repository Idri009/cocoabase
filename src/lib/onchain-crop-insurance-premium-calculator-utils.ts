import { type Address } from 'viem';

export interface PremiumCalculation {
  id: bigint;
  plantation: Address;
  coverage: bigint;
  rate: number;
  premium: bigint;
  timestamp: bigint;
}

export function calculatePremium(
  plantation: Address,
  coverage: bigint,
  rate: number
): PremiumCalculation {
  const premium = (coverage * BigInt(Math.floor(rate * 100))) / BigInt(10000);
  return {
    id: BigInt(0),
    plantation,
    coverage,
    rate,
    premium,
    timestamp: BigInt(Date.now()),
  };
}
