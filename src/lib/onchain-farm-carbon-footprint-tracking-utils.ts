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
