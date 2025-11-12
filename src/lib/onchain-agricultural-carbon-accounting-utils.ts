import { type Address } from 'viem';

export interface CarbonRecord {
  id: bigint;
  recorder: Address;
  activity: string;
  emissions: bigint;
  offset: bigint;
  timestamp: bigint;
}

export function createCarbonRecord(
  recorder: Address,
  activity: string,
  emissions: bigint,
  offset: bigint
): CarbonRecord {
  return {
    id: BigInt(0),
    recorder,
    activity,
    emissions,
    offset,
    timestamp: BigInt(Date.now()),
  };
}

