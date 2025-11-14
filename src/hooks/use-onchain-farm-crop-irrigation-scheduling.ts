import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createIrrigationSchedule,
  type IrrigationSchedule,
} from '@/lib/onchain-farm-crop-irrigation-scheduling-utils';

export function useOnchainFarmCropIrrigationScheduling() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [irrigationSchedules, setIrrigationSchedules] = useState<IrrigationSchedule[]>([]);

  const createSchedule = async (
    contractAddress: Address,
    plantationId: bigint,
    cropType: string,
    waterAmount: bigint,
    frequency: bigint,
    startDate: bigint,
    endDate: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    
    const schedule = createIrrigationSchedule(
      address,
      plantationId,
      cropType,
      waterAmount,
      frequency,
      startDate,
      endDate
    );
    
    await writeContract({
      address: contractAddress,
      abi: [
        {
          inputs: [
            { name: 'plantationId', type: 'uint256' },
            { name: 'cropType', type: 'string' },
            { name: 'waterAmount', type: 'uint256' },
            { name: 'frequency', type: 'uint256' },
            { name: 'startDate', type: 'uint256' },
            { name: 'endDate', type: 'uint256' }
          ],
          name: 'createIrrigationSchedule',
          outputs: [{ name: '', type: 'uint256' }],
          stateMutability: 'nonpayable',
          type: 'function'
        }
      ],
      functionName: 'createIrrigationSchedule',
      args: [plantationId, cropType, waterAmount, frequency, startDate, endDate],
    });
    
    setIrrigationSchedules([...irrigationSchedules, schedule]);
  };

  const executeIrrigation = async (
    contractAddress: Address,
    scheduleId: bigint,
    actualWaterAmount: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    
    await writeContract({
      address: contractAddress,
      abi: [
        {
          inputs: [
            { name: 'scheduleId', type: 'uint256' },
            { name: 'actualWaterAmount', type: 'uint256' }
          ],
          name: 'executeIrrigation',
          outputs: [{ name: '', type: 'uint256' }],
          stateMutability: 'nonpayable',
          type: 'function'
        }
      ],
      functionName: 'executeIrrigation',
      args: [scheduleId, actualWaterAmount],
    });
  };

  return { 
    irrigationSchedules, 
    createSchedule, 
    executeIrrigation, 
    address 
  };
}

