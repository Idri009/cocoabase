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

