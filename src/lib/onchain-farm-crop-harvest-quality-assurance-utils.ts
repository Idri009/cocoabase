import { type Address } from 'viem';

/**
 * Onchain farm crop harvest quality assurance utilities
 * Quality assurance creation on blockchain
 */

export interface QualityAssurance {
  id: string;
  harvestId: string;
  createdBy: Address;
  qualityStandard: string;
  testResults: string[];
  inspector: string;
  inspectionDate: bigint;
  approved: boolean;
  timestamp: bigint;
}

export function createQualityAssurance(
  address: Address,
  harvestId: string,
  qualityStandard: string,
  testResults: string[],
  inspector: string,
  inspectionDate: bigint
): QualityAssurance {
  return {
    id: `${Date.now()}-${Math.random()}`,
    harvestId,
    createdBy: address,
    qualityStandard,
    testResults,
    inspector,
    inspectionDate,
    approved: false,
    timestamp: BigInt(Date.now()),
  };
}

