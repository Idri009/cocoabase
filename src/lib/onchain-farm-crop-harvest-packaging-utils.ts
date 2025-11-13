import { type Address } from 'viem';

/**
 * Onchain farm crop harvest packaging utilities
 * Packaging record creation and verification
 */

export interface HarvestPackaging {
  id: string;
  harvestId: string;
  recordedBy: Address;
  packageType: string;
  quantity: number;
  packagingDate: bigint;
  label: string;
  verified: boolean;
  timestamp: bigint;
}

export function createPackagingRecord(
  address: Address,
  harvestId: string,
  packageType: string,
  quantity: number,
  packagingDate: bigint,
  label: string
): HarvestPackaging {
  return {
    id: `${Date.now()}-${Math.random()}`,
    harvestId,
    recordedBy: address,
    packageType,
    quantity,
    packagingDate,
    label,
    verified: false,
    timestamp: BigInt(Date.now()),
  };
}

