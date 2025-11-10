import { useState } from 'react';
import { useAccount } from 'wagmi';
import {
  scheduleHarvest,
  type HarvestSchedule,
} from '@/lib/onchain-harvest-scheduling-system-utils';

export function useOnchainHarvestSchedulingSystem() {
  const { address } = useAccount();
  const [schedules, setSchedules] = useState<HarvestSchedule[]>([]);

  const schedule = async (
    plantationId: bigint,
    scheduledDate: bigint,
    estimatedYield: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected');
    const harvest = scheduleHarvest(address, plantationId, scheduledDate, estimatedYield);
    setSchedules([...schedules, harvest]);
  };

  return { schedules, schedule, address };
}
