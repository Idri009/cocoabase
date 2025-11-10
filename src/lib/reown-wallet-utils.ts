import { type Address } from 'viem';

/**
 * Reown wallet integration utilities
 * Connect, disconnect, and manage Reown wallet sessions
 */

export interface ReownWalletSession {
  address: Address;
  chainId: number;
  connected: boolean;
  sessionId?: string;
}

/**
 * Format Reown wallet address
 */
export function formatReownAddress(address: Address): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

