import { type Address } from 'viem';

/**
 * Onchain lending utilities
 * DeFi lending and borrowing
 */

export interface LendingPool {
  address: Address;
  token: Address;
  totalSupply: bigint;
  totalBorrowed: bigint;
  interestRate: number;
}

export function calculateBorrowInterest(
  principal: bigint,
  rate: number,
  days: number
): bigint {
  return (principal * BigInt(Math.floor(rate * days * 100))) / BigInt(36500);
}

export function calculateLendingAPY(
  pool: LendingPool
): number {
  if (pool.totalSupply === BigInt(0)) return 0;
  const utilization = Number(pool.totalBorrowed) / Number(pool.totalSupply);
  return pool.interestRate * utilization;
}
