import { type Address } from 'viem';

export interface BiodiversityRecord {
  id: bigint;
  recorder: Address;
  species: string;
  count: bigint;
  habitat: string;
  timestamp: bigint;
}

export function createBiodiversityRecord(
  recorder: Address,
  species: string,
  count: bigint,
  habitat: string
): BiodiversityRecord {
  return {
    id: BigInt(0),
    recorder,
    species,
    count,
    habitat,
    timestamp: BigInt(Date.now()),
  };
}

export function getSpeciesByHabitat(
  records: BiodiversityRecord[],
  habitat: string
): BiodiversityRecord[] {
  return records.filter((r) => r.habitat === habitat);
}

export function calculateTotalSpecies(records: BiodiversityRecord[]): bigint {
  return records.reduce((total, r) => total + r.count, BigInt(0));
}

export function getUniqueSpecies(records: BiodiversityRecord[]): string[] {
  return Array.from(new Set(records.map((r) => r.species)));
}
