import { type Address } from 'viem';

/**
 * Onchain Farm Certification Renewal utilities
 * Manage certification renewals onchain with Reown wallet integration
 */

export interface CertificationRenewal {
  id: bigint;
  farmer: Address;
  certificationType: string;
  certificationNumber: string;
  expiryDate: bigint;
  renewalDate: bigint;
  status: 'pending' | 'submitted' | 'approved' | 'rejected';
  renewalFee: bigint;
  createdAt: bigint;
}

export function createRenewalRequest(
  farmer: Address,
  certificationType: string,
  certificationNumber: string,
  expiryDate: bigint,
  renewalFee: bigint
): CertificationRenewal {
  const now = BigInt(Date.now());
  return {
    id: BigInt(0),
    farmer,
    certificationType,
    certificationNumber,
    expiryDate,
    renewalDate: expiryDate,
    status: 'pending',
    renewalFee,
    createdAt: now,
  };
}

export function submitRenewal(renewal: CertificationRenewal): CertificationRenewal {
  return {
    ...renewal,
    status: 'submitted',
  };
}

export function approveRenewal(renewal: CertificationRenewal): CertificationRenewal {
  return {
    ...renewal,
    status: 'approved',
  };
}

export function isRenewalDue(renewal: CertificationRenewal, currentTime: bigint): boolean {
  const daysBeforeExpiry = BigInt(30 * 24 * 60 * 60 * 1000);
  return currentTime >= (renewal.expiryDate - daysBeforeExpiry);
}

