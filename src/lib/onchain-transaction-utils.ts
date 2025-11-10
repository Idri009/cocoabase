import { type Address, type Hash, type TransactionReceipt } from 'viem';

/**
 * Onchain transaction utilities for blockchain operations
 * Handle transaction preparation, signing, and verification
 */

export interface TransactionStatus {
  hash: Hash;
  status: 'pending' | 'confirmed' | 'failed';
  blockNumber?: bigint;
  confirmations: number;
}

export interface TransactionOptions {
  gasLimit?: bigint;
  gasPrice?: bigint;
  maxFeePerGas?: bigint;
  maxPriorityFeePerGas?: bigint;
  nonce?: number;
}

/**
 * Format transaction hash for display
 */
export function formatTxHash(hash: Hash): string {
  return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
}

/**
 * Check if transaction is confirmed
 */
export function isTransactionConfirmed(
  receipt: TransactionReceipt | null
): boolean {
  return receipt?.status === 'success';
}

