import { type Address } from 'viem';

/**
 * Onchain allowlist utilities
 * Whitelist management and access control
 */

export interface Allowlist {
  name: string;
  addresses: Address[];
  merkleRoot?: string;
}

/**
 * Check if address is in allowlist
 */
export function isAddressAllowed(
  allowlist: Allowlist,
  address: Address
): boolean {
  return allowlist.addresses.some(
    addr => addr.toLowerCase() === address.toLowerCase()
  );
}

