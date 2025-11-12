import { type Address } from 'viem';

export interface LandValuation {
  id: bigint;
  landParcel: Address;
  appraiser: Address;
  value: bigint;
  factors: string[];
  timestamp: bigint;
}

export function createValuation(
  landParcel: Address,
  appraiser: Address,
  value: bigint,
  factors: string[]
): LandValuation {
  return {
    id: BigInt(0),
    landParcel,
    appraiser,
    value,
    factors,
    timestamp: BigInt(Date.now()),
  };
}

export function getValuationsByLand(
  valuations: LandValuation[],
  landParcel: Address
): LandValuation[] {
  return valuations.filter((v) => v.landParcel === landParcel);
}

export function getRecentValuations(
  valuations: LandValuation[],
  days: number
): LandValuation[] {
  const cutoff = BigInt(Date.now()) - BigInt(days * 24 * 60 * 60 * 1000);
  return valuations.filter((v) => v.timestamp >= cutoff);
}

export function calculateAverageValuation(
  valuations: LandValuation[]
): bigint {
  if (valuations.length === 0) return BigInt(0);
  const total = valuations.reduce((sum, v) => sum + v.value, BigInt(0));
  return total / BigInt(valuations.length);
}
