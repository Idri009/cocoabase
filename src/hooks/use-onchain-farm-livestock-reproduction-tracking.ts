import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createReproductionCycle,
  type ReproductionCycle,
} from '@/lib/onchain-farm-livestock-reproduction-tracking-utils';

/**
 * Hook for onchain livestock reproduction tracking
 * Uses Reown wallet for all transactions
 */
export function useOnchainFarmLivestockReproductionTracking() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [reproductionCycles, setReproductionCycles] = useState<ReproductionCycle[]>([]);

  const startCycle = async (
    contractAddress: Address,
    livestockId: bigint,
    expectedBirthDate: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    
    const cycle = createReproductionCycle(
      address,
      livestockId,
      expectedBirthDate
    );
    
    await writeContract({
      address: contractAddress,
      abi: [
        {
          inputs: [
            { name: 'livestockId', type: 'uint256' },
            { name: 'expectedBirthDate', type: 'uint256' }
          ],
          name: 'startReproductionCycle',
          outputs: [{ name: '', type: 'uint256' }],
          stateMutability: 'nonpayable',
          type: 'function'
        }
      ],
      functionName: 'startReproductionCycle',
      args: [livestockId, expectedBirthDate],
    });
    
    setReproductionCycles([...reproductionCycles, cycle]);
  };

  const recordBirth = async (
    contractAddress: Address,
    cycleId: bigint,
    offspringCount: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    
    await writeContract({
      address: contractAddress,
      abi: [
        {
          inputs: [
            { name: 'cycleId', type: 'uint256' },
            { name: 'offspringCount', type: 'uint256' }
          ],
          name: 'recordBirth',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function'
        }
      ],
      functionName: 'recordBirth',
      args: [cycleId, offspringCount],
    });
  };

  return { 
    reproductionCycles, 
    startCycle, 
    recordBirth, 
    address 
  };
}
