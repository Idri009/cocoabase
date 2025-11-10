import { type Address, type Hash } from 'viem';

/**
 * Onchain analytics utilities
 * Analyze onchain data, transactions, and metrics
 */

export interface TransactionMetrics {
  totalTransactions: number;
  totalVolume: bigint;
  averageGasUsed: bigint;
  successRate: number;
  uniqueAddresses: number;
}

export interface WalletAnalytics {
  address: Address;
  totalTransactions: number;
  totalVolume: bigint;
  firstTx: Hash;
  lastTx: Hash;
  averageGasPrice: bigint;
}

/**
 * Calculate transaction success rate
 */
export function calculateSuccessRate(
  successful: number,
  total: number
): number {
  if (total === 0) return 0;
  return (successful / total) * 100;
}

/**
 * Calculate average gas price
 */
export function calculateAverageGasPrice(
  gasPrices: bigint[]
): bigint {
  if (gasPrices.length === 0) return BigInt(0);
  const sum = gasPrices.reduce((acc, price) => acc + price, BigInt(0));
  return sum / BigInt(gasPrices.length);
}

/**
 * Calculate total volume
 */
export function calculateTotalVolume(amounts: bigint[]): bigint {
  return amounts.reduce((acc, amount) => acc + amount, BigInt(0));
}

