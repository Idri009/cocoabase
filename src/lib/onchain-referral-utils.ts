import { type Address } from 'viem';

/**
 * Onchain referral program utilities
 * Referral tracking and rewards
 */

export interface Referral {
  referrer: Address;
  referee: Address;
  createdAt: bigint;
  rewardEarned: bigint;
  active: boolean;
}

export interface ReferralReward {
  referral: Address;
  amount: bigint;
  token: Address;
  timestamp: bigint;
  level: number;
}

export function createReferral(
  referrer: Address,
  referee: Address
): Referral {
  return {
    referrer,
    referee,
    createdAt: BigInt(Date.now()),
    rewardEarned: BigInt(0),
    active: true,
  };
}

export function calculateReferralReward(
  baseAmount: bigint,
  referralRate: number = 0.1
): bigint {
  return (baseAmount * BigInt(Math.floor(referralRate * 10000))) / BigInt(10000);
}

export function calculateMultiLevelReward(
  baseAmount: bigint,
  level: number,
  rates: number[] = [0.1, 0.05, 0.02]
): bigint {
  const rate = rates[level] || 0;
  return (baseAmount * BigInt(Math.floor(rate * 10000))) / BigInt(10000);
}

export function getReferralDepth(
  referrals: Map<Address, Address>,
  address: Address,
  maxDepth: number = 10
): number {
  let depth = 0;
  let current = address;
  while (depth < maxDepth && referrals.has(current)) {
    current = referrals.get(current)!;
    depth++;
  }
  return depth;
}

export function validateReferral(
  referrer: Address,
  referee: Address
): boolean {
  return referrer !== referee && referrer !== Address('0x0');
}

export function distributeReferralRewards(
  referrals: Referral[],
  totalReward: bigint,
  rates: number[]
): Map<Address, bigint> {
  const rewards = new Map<Address, bigint>();
  referrals.forEach((ref, index) => {
    const rate = rates[index] || 0;
    const reward = (totalReward * BigInt(Math.floor(rate * 10000))) / BigInt(10000);
    rewards.set(ref.referrer, reward);
  });
  return rewards;
}
