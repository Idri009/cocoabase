import { type Address } from 'viem';

/**
 * Onchain farm crop certification utilities
 * Crop quality certification
 */

export interface Certification {
  id: string;
  certificationId: bigint;
  farmer: Address;
  cropId: bigint;
  certificationType: string;
  qualityGrade: string;
  issueDate: bigint;
  expiryDate: bigint;
  isActive: boolean;
  isRevoked: boolean;
  inspector: string;
  notes: string;
}

export function createCertification(
  address: Address,
  cropId: bigint,
  certificationType: string,
  qualityGrade: string,
  expiryDate: bigint,
  inspector: string,
  notes: string
): Certification {
  return {
    id: `${Date.now()}-${Math.random()}`,
    certificationId: BigInt(0),
    farmer: address,
    cropId,
    certificationType,
    qualityGrade,
    issueDate: BigInt(Date.now()),
    expiryDate,
    isActive: true,
    isRevoked: false,
    inspector,
    notes,
  };
}

