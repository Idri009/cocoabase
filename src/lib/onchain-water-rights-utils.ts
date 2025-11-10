import { type Address } from 'viem';

export interface WaterRight {
  id: bigint;
  owner: Address;
  plantationId: bigint;
  allocation: bigint;
  usage: bigint;
  startDate: bigint;
  endDate: bigint;
  txHash: string;
}

export function allocateWaterRight(
  owner: Address,
  plantationId: bigint,
  allocation: bigint,
  startDate: bigint,
  endDate: bigint
): WaterRight {
  return {
    id: BigInt(Date.now()),
    owner,
    plantationId,
    allocation,
    usage: BigInt(0),
    startDate,
    endDate,
    txHash: '',
  };
}

export function recordWaterUsage(
  right: WaterRight,
  amount: bigint
): WaterRight | null {
  if (right.usage + amount > right.allocation) return null;
  return {
    ...right,
    usage: right.usage + amount,
  };
}

export function getRemainingAllocation(right: WaterRight): bigint {
  return right.allocation - right.usage;
}
