import { type Address } from 'viem';

/**
 * Onchain farm harvest certification utilities
 * Harvest certification creation and verification
 */

export interface HarvestCertification {
  id: string;
  harvestId: string;
  certifiedBy: Address;
  certType: string;
  standards: string[];
  certDate: bigint;
  verified: boolean;
  timestamp: bigint;
}

export function createHarvestCert(
  address: Address,
  harvestId: string,
  certType: string,
  standards: string[],
  certDate: bigint
): HarvestCertification {
  return {
    id: `${Date.now()}-${Math.random()}`,
    harvestId,
    certifiedBy: address,
    certType,
    standards,
    certDate,
    verified: false,
    timestamp: BigInt(Date.now()),
  };
}

