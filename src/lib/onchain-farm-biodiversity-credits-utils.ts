import { type Address } from 'viem';

/**
 * Onchain farm biodiversity credits utilities
 * Biodiversity credit minting and trading
 */

export interface BiodiversityCredit {
  id: string;
  plantationId: string;
  owner: Address;
  speciesCount: number;
  habitatArea: bigint;
  creditValue: bigint;
  timestamp: bigint;
}

export function createBiodiversityCredit(
  address: Address,
  plantationId: string,
  speciesCount: number,
  habitatArea: bigint
): BiodiversityCredit {
  const creditValue = habitatArea * BigInt(speciesCount) * BigInt(100); // Simple calculation
  return {
    id: `${Date.now()}-${Math.random()}`,
    plantationId,
    owner: address,
    speciesCount,
    habitatArea,
    creditValue,
    timestamp: BigInt(Date.now()),
  };
}

