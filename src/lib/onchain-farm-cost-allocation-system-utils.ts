import { type Address } from 'viem';

export interface CostAllocation {
  id: bigint;
  allocator: Address;
  costCenter: string;
  amount: bigint;
  category: string;
  timestamp: bigint;
}

export function createCostAllocation(
  allocator: Address,
  costCenter: string,
  amount: bigint,
  category: string
): CostAllocation {
  return {
    id: BigInt(0),
    allocator,
    costCenter,
    amount,
    category,
    timestamp: BigInt(Date.now()),
  };
}
