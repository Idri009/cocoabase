import { type Address } from 'viem';

export interface LandValuation {
  id: bigint;
  owner: Address;
  landParcelId: bigint;
  valuationAmount: bigint;
  valuationDate: bigint;
  appraiser: Address;
  factors: string;
  txHash: string;
}

export function createValuation(
  owner: Address,
  landParcelId: bigint,
  valuationAmount: bigint,
  appraiser: Address,
  factors: string
): LandValuation {
  return {
    id: BigInt(Date.now()),
    owner,
    landParcelId,
    valuationAmount,
    valuationDate: BigInt(Date.now()),
    appraiser,
    factors,
    txHash: '',
  };
}

export function getValuationsByLand(
  valuations: LandValuation[],
  landParcelId: bigint
): LandValuation[] {
  return valuations
    .filter((v) => v.landParcelId === landParcelId)
    .sort((a, b) => (a.valuationDate > b.valuationDate ? -1 : 1));
}

export function getRecentValuations(
  valuations: LandValuation[],
  days: number
): LandValuation[] {
  const cutoff = BigInt(Date.now() - days * 24 * 60 * 60 * 1000);
  return valuations.filter((v) => v.valuationDate >= cutoff);
}

export function calculateAverageValuation(
  valuations: LandValuation[]
): bigint {
  if (valuations.length === 0) return BigInt(0);
  const total = valuations.reduce((sum, v) => sum + v.valuationAmount, BigInt(0));
  return total / BigInt(valuations.length);
}
