import { type Address } from 'viem';

/**
 * Onchain Organic Certification Verification utilities
 * Verify organic certification status onchain
 */

export interface OrganicCertification {
  id: bigint;
  farmer: Address;
  certificationBody: string;
  certificationNumber: string;
  cropType: string;
  issueDate: bigint;
  expiryDate: bigint;
  status: 'active' | 'expired' | 'revoked';
  verificationHash: string;
}

export function createOrganicCertification(
  farmer: Address,
  certificationBody: string,
  certificationNumber: string,
  cropType: string,
  issueDate: bigint,
  expiryDate: bigint,
  verificationHash: string
): OrganicCertification {
  return {
    id: BigInt(0),
    farmer,
    certificationBody,
    certificationNumber,
    cropType,
    issueDate,
    expiryDate,
    status: 'active',
    verificationHash,
  };
}

export function verifyOrganicCertification(
  certification: OrganicCertification,
  currentTime: bigint
): boolean {
  if (certification.status !== 'active') return false;
  if (currentTime > certification.expiryDate) return false;
  return certification.verificationHash.length > 0;
}

export function checkCertificationExpiry(
  certification: OrganicCertification,
  currentTime: bigint
): boolean {
  return currentTime > certification.expiryDate;
}

export function revokeCertification(
  certification: OrganicCertification
): OrganicCertification {
  return {
    ...certification,
    status: 'revoked',
  };
}

export function calculateDaysUntilExpiry(
  certification: OrganicCertification,
  currentTime: bigint
): bigint {
  if (certification.status !== 'active') return BigInt(0);
  const daysRemaining = (certification.expiryDate - currentTime) / BigInt(86400000);
  return daysRemaining > BigInt(0) ? daysRemaining : BigInt(0);
}

