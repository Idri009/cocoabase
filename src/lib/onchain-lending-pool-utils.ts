import { type Address } from 'viem';

export interface LendingPool {
  id: bigint;
  token: Address;
  interestRate: number;
  totalLent: bigint;
  totalBorrowed: bigint;
  utilizationRate: number;
}

export function createLendingPool(
  token: Address,
  interestRate: number
): LendingPool {
  return {
    id: BigInt(0),
    token,
    interestRate,
    totalLent: BigInt(0),
    totalBorrowed: BigInt(0),
    utilizationRate: 0,
  };
}

