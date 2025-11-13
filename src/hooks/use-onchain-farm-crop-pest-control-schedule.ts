import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createPestControlSchedule,
  type PestControlSchedule,
} from '@/lib/onchain-farm-crop-pest-control-schedule-utils';

/**
 * Hook for onchain farm crop pest control scheduling
 * Uses Reown wallet for all transactions
 */
export function useOnchainFarmCropPestControlSchedule() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [schedules, setSchedules] = useState<PestControlSchedule[]>([]);

  const createSchedule = async (
    plantationId: string,
    treatmentType: string,
    scheduledDate: bigint,
    targetPest: string
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    const schedule = createPestControlSchedule(address, plantationId, treatmentType, scheduledDate, targetPest);
    setSchedules([...schedules, schedule]);
  };

  const executeTreatment = async (
    contractAddress: Address,
    scheduleId: string
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    await writeContract({
      address: contractAddress,
      abi: [],
      functionName: 'executeTreatment',
      args: [scheduleId],
    });
  };

  return { schedules, createSchedule, executeTreatment, address };
}

