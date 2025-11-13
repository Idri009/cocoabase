import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createAllocation,
  type ResourceAllocation,
} from '@/lib/onchain-farm-resource-allocation-utils';

/**
 * Hook for onchain farm resource allocation
 * Uses Reown wallet for all transactions
 */
export function useOnchainFarmResourceAllocation() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [allocations, setAllocations] = useState<ResourceAllocation[]>([]);

  const allocateResource = async (
    plantationId: string,
    resourceType: string,
    amount: bigint,
    allocationDate: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    const allocation = createAllocation(address, plantationId, resourceType, amount, allocationDate);
    setAllocations([...allocations, allocation]);
  };

  const updateAllocation = async (
    contractAddress: Address,
    allocationId: string,
    newAmount: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    await writeContract({
      address: contractAddress,
      abi: [],
      functionName: 'updateAllocation',
      args: [allocationId, newAmount],
    });
  };

  return { allocations, allocateResource, updateAllocation, address };
}

