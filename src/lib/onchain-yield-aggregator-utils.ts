import { type Address } from 'viem';

export interface YieldStrategy {
  id: bigint;
  name: string;
  token: Address;
  apy: number;
  risk: 'low' | 'medium' | 'high';
  minDeposit: bigint;
}

export interface YieldPosition {
  user: Address;
  strategy: bigint;
  amount: bigint;
  shares: bigint;
  depositedAt: bigint;
}

export function createYieldStrategy(
  name: string,
  token: Address,
  apy: number,
  risk: 'low' | 'medium' | 'high',
  minDeposit: bigint
): YieldStrategy {
  return {
    id: BigInt(0),
    name,
    token,
    apy,
    risk,
    minDeposit,
  };
}

export function depositToStrategy(
  strategy: YieldStrategy,
  user: Address,
  amount: bigint,
  currentTime: bigint
): YieldPosition {
  return {
    user,
    strategy: strategy.id,
    amount,
    shares: amount,
    depositedAt: currentTime,
  };
}

export function calculateYield(
  position: YieldPosition,
  strategy: YieldStrategy,
  currentTime: bigint
): bigint {
  const daysStaked = (currentTime - position.depositedAt) / BigInt(86400);
  const annualYield = (position.amount * BigInt(Math.floor(strategy.apy * 100))) / BigInt(10000);
  return (annualYield * daysStaked) / BigInt(365);
}

