import { type Address } from 'viem';

export interface BiodiversityRecord {
  id: bigint;
  recorder: Address;
  species: string;
  count: bigint;
  location: string;
  timestamp: bigint;
}

export function createBiodiversityRecord(
  recorder: Address,
  species: string,
  count: bigint,
  location: string
): BiodiversityRecord {
  return {
    id: BigInt(Date.now()),
    recorder,
    species,
    count,
    location,
    timestamp: BigInt(Date.now()),
  };
}