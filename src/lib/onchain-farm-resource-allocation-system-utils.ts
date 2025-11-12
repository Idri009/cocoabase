import { type Address } from 'viem';

export interface ResourceAllocation {
  id: bigint;
  owner: Address;
  resourceType: string;
  quantity: bigint;
  allocatedTo: string;
  allocationDate: bigint;
  txHash: string;
}

export function allocateResource(
  owner: Address,
  resourceType: string,
  quantity: bigint,
  allocatedTo: string
): ResourceAllocation {
  return {
    id: BigInt(Date.now()),
    owner,
    resourceType,
    quantity,
    allocatedTo,
    allocationDate: BigInt(Date.now()),
    txHash: '',
  };
}

export function getAllocationsByResource(
  allocations: ResourceAllocation[],
  resourceType: string
): ResourceAllocation[] {
  return allocations.filter((a) => a.resourceType === resourceType);
}

export function getTotalAllocated(
  allocations: ResourceAllocation[],
  resourceType: string
): bigint {
  return allocations
    .filter((a) => a.resourceType === resourceType)
    .reduce((total, a) => total + a.quantity, BigInt(0));
}

export function getAllocationsByRecipient(
  allocations: ResourceAllocation[],
  allocatedTo: string
): ResourceAllocation[] {
  return allocations.filter((a) => a.allocatedTo === allocatedTo);
}
