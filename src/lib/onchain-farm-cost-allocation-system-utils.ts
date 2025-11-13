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

export function getAllocationsByCostCenter(
  allocations: CostAllocation[],
  costCenter: string
): CostAllocation[] {
  return allocations.filter((a) => a.costCenter === costCenter);
}

export function calculateTotalByCategory(
  allocations: CostAllocation[],
  category: string
): bigint {
  return allocations
    .filter((a) => a.category === category)
    .reduce((total, a) => total + a.amount, BigInt(0));
}

export function calculateTotalAllocation(
  allocations: CostAllocation[]
): bigint {
  return allocations.reduce((total, a) => total + a.amount, BigInt(0));
}
