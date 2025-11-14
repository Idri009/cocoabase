import { type Address } from 'viem';

/**
 * Onchain farm crop harvest labeling utilities
 * Label creation and verification
 */

export interface HarvestLabel {
  id: string;
  harvestId: string;
  createdBy: Address;
  labelType: string;
  labelContent: string;
  labelingDate: bigint;
  verified: boolean;
  timestamp: bigint;
}

export function createLabel(
  address: Address,
  harvestId: string,
  labelType: string,
  labelContent: string,
  labelingDate: bigint
): HarvestLabel {
  return {
    id: `${Date.now()}-${Math.random()}`,
    harvestId,
    createdBy: address,
    labelType,
    labelContent,
    labelingDate,
    verified: false,
    timestamp: BigInt(Date.now()),
  };
}

