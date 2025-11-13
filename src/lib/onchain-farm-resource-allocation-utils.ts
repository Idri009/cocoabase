import { type Address } from 'viem';

/**
 * Onchain farm resource allocation utilities
 * Resource allocation creation and updates
 */

export interface ResourceAllocation {
  id: string;
  plantationId: string;
  allocatedBy: Address;
  resourceType: string;
  amount: bigint;
  allocationDate: bigint;
  timestamp: bigint;
}

export function createAllocation(
  address: Address,
  plantationId: string,
  resourceType: string,
  amount: bigint,
  allocationDate: bigint
): ResourceAllocation {
  return {
    id: `${Date.now()}-${Math.random()}`,
    plantationId,
    allocatedBy: address,
    resourceType,
    amount,
    allocationDate,
    timestamp: BigInt(Date.now()),
  };
}

