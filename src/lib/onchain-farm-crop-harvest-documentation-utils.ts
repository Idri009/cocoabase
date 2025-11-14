import { type Address } from 'viem';

/**
 * Onchain farm crop harvest documentation utilities
 * Documentation creation and verification
 */

export interface HarvestDocumentation {
  id: string;
  harvestId: string;
  createdBy: Address;
  documentType: string;
  documentHash: string;
  description: string;
  documentDate: bigint;
  verified: boolean;
  timestamp: bigint;
}

export function createDocumentation(
  address: Address,
  harvestId: string,
  documentType: string,
  documentHash: string,
  description: string,
  documentDate: bigint
): HarvestDocumentation {
  return {
    id: `${Date.now()}-${Math.random()}`,
    harvestId,
    createdBy: address,
    documentType,
    documentHash,
    description,
    documentDate,
    verified: false,
    timestamp: BigInt(Date.now()),
  };
}

