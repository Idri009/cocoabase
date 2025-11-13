import { type Address } from 'viem';

/**
 * Onchain farm certification management utilities
 * Certification creation and renewal
 */

export interface Certification {
  id: string;
  plantationId: string;
  owner: Address;
  certType: string;
  standard: string;
  expiryDate: bigint;
  active: boolean;
  timestamp: bigint;
}

export function createCertification(
  address: Address,
  plantationId: string,
  certType: string,
  standard: string,
  expiryDate: bigint
): Certification {
  return {
    id: `${Date.now()}-${Math.random()}`,
    plantationId,
    owner: address,
    certType,
    standard,
    expiryDate,
    active: true,
    timestamp: BigInt(Date.now()),
  };
}

