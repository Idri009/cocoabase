import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createHarvestSchedule,
  type HarvestSchedule,
} from '@/lib/onchain-farm-harvest-scheduling-utils';

export function useOnchainFarmHarvestScheduling() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [schedules, setSchedules] = useState<HarvestSchedule[]>([]);

  const scheduleHarvest = async (
    contractAddress: Address,
    plantationId: bigint,
    scheduledDate: bigint,
    expectedYield: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    
    const schedule = createHarvestSchedule(address, plantationId, scheduledDate, expectedYield);
    
    await writeContract({
      address: contractAddress,
      abi: [
        {
          inputs: [
            { name: 'plantationId', type: 'uint256' },
            { name: 'scheduledDate', type: 'uint256' },
            { name: 'expectedYield', type: 'uint256' }
          ],
          name: 'scheduleHarvest',
          outputs: [{ name: '', type: 'uint256' }],
          stateMutability: 'nonpayable',
          type: 'function'
        }
      ],
      functionName: 'scheduleHarvest',
      args: [plantationId, scheduledDate, expectedYield],
    });
    
    setSchedules([...schedules, schedule]);
  };

  const completeHarvest = async (
    contractAddress: Address,
    scheduleId: bigint,
    actualYield: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    
    await writeContract({
      address: contractAddress,
      abi: [
        {
          inputs: [
            { name: 'scheduleId', type: 'uint256' },
            { name: 'actualYield', type: 'uint256' }
          ],
          name: 'completeHarvest',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function'
        }
      ],
      functionName: 'completeHarvest',
      args: [scheduleId, actualYield],
    });
  };

  return { schedules, scheduleHarvest, completeHarvest, address };
}
