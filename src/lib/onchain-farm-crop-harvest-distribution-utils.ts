import { type Address } from 'viem';

/**
 * Onchain farm crop harvest distribution utilities
 * Distribution creation and confirmation
 */

export interface HarvestDistribution {
  id: string;
  harvestId: string;
  distributor: Address;
  recipient: Address;
  amount: bigint;
  distributionDate: bigint;
  confirmed: boolean;
  timestamp: bigint;
}

export function createDistribution(
  distributor: Address,
  harvestId: string,
  recipient: Address,
  amount: bigint,
  distributionDate: bigint
): HarvestDistribution {
  return {
    id: `${Date.now()}-${Math.random()}`,
    harvestId,
    distributor,
    recipient,
    amount,
    distributionDate,
    confirmed: false,
    timestamp: BigInt(Date.now()),
  };
}

