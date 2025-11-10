import { type Address, type Hash } from 'viem';

/**
 * Blockchain explorer integration utilities
 * Generate explorer URLs and fetch onchain data
 */

export interface ExplorerConfig {
  baseUrl: string;
  apiKey?: string;
}

export interface TransactionInfo {
  hash: Hash;
  from: Address;
  to: Address;
  value: bigint;
  gasUsed: bigint;
  status: 'success' | 'failed';
}

/**
 * Format explorer URL for transaction
 */
export function formatTxExplorerURL(
  explorerUrl: string,
  txHash: Hash
): string {
  return `${explorerUrl}/tx/${txHash}`;
}

