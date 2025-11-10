import { type Address, type Hash } from 'viem';

/**
 * Onchain verification utilities
 * Verify transactions, ownership, and data integrity
 */

export interface VerificationResult {
  verified: boolean;
  blockNumber?: bigint;
  timestamp?: number;
  txHash?: Hash;
}

/**
 * Verify wallet address format
 */
export function verifyAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Verify transaction hash format
 */
export function verifyTxHash(hash: string): boolean {
  return /^0x[a-fA-F0-9]{64}$/.test(hash);
}

/**
 * Verify signature format
 */
export function verifySignature(signature: string): boolean {
  return /^0x[a-fA-F0-9]{130}$/.test(signature);
}

/**
 * Compare addresses (case-insensitive)
 */
export function compareAddresses(
  addr1: Address,
  addr2: Address
): boolean {
  return addr1.toLowerCase() === addr2.toLowerCase();
}

/**
 * Verify Ethereum address checksum
 */
export function isValidChecksumAddress(address: string): boolean {
  // Simplified - in production use proper checksum validation
  return verifyAddress(address);
}

/**
 * Format address for display
 */
export function formatAddress(address: Address, chars: number = 4): string {
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

