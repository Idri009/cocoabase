import { type Address } from 'viem';

/**
 * Onchain Land Tenure Verification utilities
 * Verify land ownership and tenure onchain
 */

export interface LandTenure {
  id: bigint;
  landOwner: Address;
  landId: string;
  location: string;
  area: bigint;
  tenureType: 'freehold' | 'leasehold' | 'communal' | 'customary';
  issueDate: bigint;
  expiryDate?: bigint;
  status: 'active' | 'expired' | 'revoked';
  verificationHash: string;
}

export function createLandTenure(
  landOwner: Address,
  landId: string,
  location: string,
  area: bigint,
  tenureType: LandTenure['tenureType'],
  issueDate: bigint,
  expiryDate: bigint | undefined,
  verificationHash: string
): LandTenure {
  return {
    id: BigInt(0),
    landOwner,
    landId,
    location,
    area,
    tenureType,
    issueDate,
    expiryDate,
    status: 'active',
    verificationHash,
  };
}

export function verifyLandTenure(
  tenure: LandTenure,
  currentTime: bigint
): boolean {
  if (tenure.status !== 'active') return false;
  if (tenure.expiryDate && currentTime > tenure.expiryDate) return false;
  return tenure.verificationHash.length > 0;
}

export function transferLandTenure(
  tenure: LandTenure,
  newOwner: Address
): LandTenure {
  if (tenure.status !== 'active') return tenure;
  return {
    ...tenure,
    landOwner: newOwner,
  };
}

export function revokeLandTenure(tenure: LandTenure): LandTenure {
  return {
    ...tenure,
    status: 'revoked',
  };
}

export function isTenureExpired(
  tenure: LandTenure,
  currentTime: bigint
): boolean {
  if (!tenure.expiryDate) return false;
  return currentTime > tenure.expiryDate;
}

