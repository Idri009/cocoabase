import { type Address } from 'viem';

export interface SoilHealthRecord {
  id: bigint;
  recorder: Address;
  location: string;
  phLevel: number;
  organicMatter: number;
  timestamp: bigint;
}

export function createSoilHealthRecord(
  recorder: Address,
  location: string,
  phLevel: number,
  organicMatter: number
): SoilHealthRecord {
  return {
    id: BigInt(Date.now()),
    recorder,
    location,
    phLevel,
    organicMatter,
    timestamp: BigInt(Date.now()),
  };
}