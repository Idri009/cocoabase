import { type Address } from 'viem';

/**
 * Onchain farm crop harvest quality control utilities
 * Quality control creation and approval
 */

export interface HarvestQualityControl {
  id: string;
  harvestId: string;
  performedBy: Address;
  qualityStandard: string;
  testResults: string[];
  inspector: string;
  inspectionDate: bigint;
  approved: boolean;
  timestamp: bigint;
}

export function createQualityControl(
  address: Address,
  harvestId: string,
  qualityStandard: string,
  testResults: string[],
  inspector: string,
  inspectionDate: bigint
): HarvestQualityControl {
  return {
    id: `${Date.now()}-${Math.random()}`,
    harvestId,
    performedBy: address,
    qualityStandard,
    testResults,
    inspector,
    inspectionDate,
    approved: false,
    timestamp: BigInt(Date.now()),
  };
}

