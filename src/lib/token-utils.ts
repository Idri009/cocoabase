import { type Address } from 'viem';

/**
 * Token utilities for ERC-20 and ERC-721 operations
 * Balance checks, transfers, and approvals
 */

export interface TokenBalance {
  address: Address;
  balance: bigint;
  decimals: number;
  symbol: string;
}

export interface TokenTransfer {
  from: Address;
  to: Address;
  amount: bigint;
  tokenAddress: Address;
}

/**
 * Format token amount with decimals
 */
export function formatTokenAmount(
  amount: bigint,
  decimals: number = 18
): string {
  const divisor = BigInt(10 ** decimals);
  const whole = amount / divisor;
  const fraction = amount % divisor;
  return `${whole}.${fraction.toString().padStart(decimals, '0')}`;
}

/**
 * Parse token amount from string
 */
export function parseTokenAmount(
  amount: string,
  decimals: number = 18
): bigint {
  const [whole, fraction = ''] = amount.split('.');
  const paddedFraction = fraction.padEnd(decimals, '0').slice(0, decimals);
  return BigInt(whole) * BigInt(10 ** decimals) + BigInt(paddedFraction || '0');
}

/**
 * Calculate token transfer fee
 */
export function calculateTransferFee(
  amount: bigint,
  feePercent: number = 0.25
): bigint {
  return (amount * BigInt(feePercent * 100)) / BigInt(10000);
}

