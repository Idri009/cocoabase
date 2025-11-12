import { type Address } from 'viem';

export interface CostAllocation {
  id: bigint;
  owner: Address;
  costType: string;
  amount: bigint;
  allocatedTo: string;
  allocationDate: bigint;
  txHash: string;
}

export function allocateCost(
  owner: Address,
  costType: string,
  amount: bigint,
  allocatedTo: string
): CostAllocation {
  return {
    id: BigInt(Date.now()),
    owner,
    costType,
    amount,
    allocatedTo,
    allocationDate: BigInt(Date.now()),
    txHash: '',
  };
}
