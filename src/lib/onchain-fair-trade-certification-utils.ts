import { type Address } from 'viem';

/**
 * Onchain Fair Trade Certification utilities
 * Verify fair trade certification onchain
 */

export interface FairTradeCertification {
  id: bigint;
  farmer: Address;
  certificationBody: string;
  certificationNumber: string;
  productType: string;
  issueDate: bigint;
  expiryDate: bigint;
  status: 'active' | 'expired' | 'revoked';
  premiumPercentage: number;
  verificationHash: string;
}

export function createFairTradeCertification(
  farmer: Address,
  certificationBody: string,
  certificationNumber: string,
  productType: string,
  issueDate: bigint,
  expiryDate: bigint,
  premiumPercentage: number,
  verificationHash: string
): FairTradeCertification {
  return {
    id: BigInt(0),
    farmer,
    certificationBody,
    certificationNumber,
    productType,
    issueDate,
    expiryDate,
    status: 'active',
    premiumPercentage,
    verificationHash,
  };
}

export function verifyFairTradeCertification(
  certification: FairTradeCertification,
  currentTime: bigint
): boolean {
  if (certification.status !== 'active') return false;
  if (currentTime > certification.expiryDate) return false;
  return certification.verificationHash.length > 0;
}

export function calculateFairTradePremium(
  basePrice: bigint,
  premiumPercentage: number
): bigint {
  return (basePrice * BigInt(premiumPercentage)) / BigInt(100);
}

export function revokeFairTradeCertification(
  certification: FairTradeCertification
): FairTradeCertification {
  return {
    ...certification,
    status: 'revoked',
  };
}

export function checkFairTradeExpiry(
  certification: FairTradeCertification,
  currentTime: bigint
): boolean {
  return currentTime > certification.expiryDate;
}

