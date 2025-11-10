import { type Address } from 'viem';

export interface RewardDistribution {
  id: bigint;
  token: Address;
  totalRewards: bigint;
  distributed: bigint;
  recipients: Map<Address, bigint>;
}

export function createRewardDistribution(
  token: Address,
  totalRewards: bigint
): RewardDistribution {
  return {
    id: BigInt(0),
    token,
    totalRewards,
    distributed: BigInt(0),
    recipients: new Map(),
  };
}

export function distributeReward(
  distribution: RewardDistribution,
  recipient: Address,
  amount: bigint
): RewardDistribution | null {
  if (distribution.distributed + amount > distribution.totalRewards) return null;
  const newRecipients = new Map(distribution.recipients);
  const existing = newRecipients.get(recipient) || BigInt(0);
  newRecipients.set(recipient, existing + amount);
  return {
    ...distribution,
    distributed: distribution.distributed + amount,
    recipients: newRecipients,
  };
}

export function calculateRemainingRewards(
  distribution: RewardDistribution
): bigint {
  return distribution.totalRewards - distribution.distributed;
}

export function getRecipientReward(
  distribution: RewardDistribution,
  recipient: Address
): bigint {
  return distribution.recipients.get(recipient) || BigInt(0);
}
