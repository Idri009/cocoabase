import { type Address } from 'viem';

export interface CarbonFootprint {
  id: bigint;
  recorder: Address;
  activity: string;
  emissions: bigint;
  offset: bigint;
  netEmissions: bigint;
  timestamp: bigint;
}

export function createCarbonFootprint(
  recorder: Address,
  activity: string,
  emissions: bigint,
  offset: bigint
): CarbonFootprint {
  const netEmissions = emissions - offset;
  return {
    id: BigInt(Date.now()),
    recorder,
    activity,
    emissions,
    offset,
    netEmissions,
    timestamp: BigInt(Date.now()),
  };
}

export function getTotalNetEmissions(
  footprints: CarbonFootprint[]
): bigint {
  return footprints.reduce((total, f) => total + f.netEmissions, BigInt(0));
}

export function isCarbonNeutral(
  footprint: CarbonFootprint
): boolean {
  return footprint.netEmissions <= BigInt(0);
}
