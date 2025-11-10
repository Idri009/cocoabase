import { type Address } from 'viem';

/**
 * Onchain identity utilities
 * ENS, identity verification, and wallet reputation
 */

export interface OnchainIdentity {
  address: Address;
  ensName?: string;
  avatar?: string;
  verified: boolean;
}

/**
 * Format ENS name or address
 */
export function formatIdentity(identity: OnchainIdentity): string {
  return identity.ensName || identity.address;
}

