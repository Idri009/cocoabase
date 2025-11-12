import { type Address } from 'viem';

export interface LandValuation {
  id: bigint;
  appraiser: Address;
  landId: string;
  value: bigint;
  factors: string[];
  timestamp: bigint;
}

export function createValuation(
  appraiser: Address,
  landId: string,
  value: bigint,
  factors: string[]
): LandValuation {
  return {
    id: BigInt(0),
    appraiser,
    landId,
    value,
    factors,
    timestamp: BigInt(Date.now()),
  };
}

export function getValuationByLand(
  valuations: LandValuation[],
  landId: string
): LandValuation | null {
  const landValuations = valuations.filter((v) => v.landId === landId);
  if (landValuations.length === 0) return null;
  return landValuations.reduce((latest, v) =>
    v.timestamp > latest.timestamp ? v : latest
  );
}

export function calculateTotalValue(
  valuations: LandValuation[]
): bigint {
  return valuations.reduce((total, v) => total + v.value, BigInt(0));
}

export function getRecentValuations(
  valuations: LandValuation[],
  days: number
): LandValuation[] {
  const cutoff = BigInt(Date.now()) - BigInt(days * 24 * 60 * 60 * 1000);
  return valuations.filter((v) => v.timestamp >= cutoff);
}
