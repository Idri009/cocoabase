import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createVaccinationSchedule,
  type VaccinationSchedule,
} from '@/lib/onchain-farm-livestock-vaccination-schedule-utils';

/**
 * Hook for onchain farm livestock vaccination schedule
 * Uses blockchain wallet for all web3 transactions
 */
export function useOnchainFarmLivestockVaccinationSchedule() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [schedules, setSchedules] = useState<VaccinationSchedule[]>([]);

  const scheduleVaccination = async (
    animalId: string,
    vaccineType: string,
    scheduledDate: bigint,
    veterinarian: string
  ): Promise<void> => {
    if (!address) throw new Error('Web3 wallet not connected');
    const schedule = createVaccinationSchedule(address, animalId, vaccineType, scheduledDate, veterinarian);
    setSchedules([...schedules, schedule]);
  };

  const recordVaccination = async (
    contractAddress: Address,
    scheduleId: string
  ): Promise<void> => {
    if (!address) throw new Error('Web3 wallet not connected');
    await writeContract({
      address: contractAddress,
      abi: [],
      functionName: 'recordVaccination',
      args: [scheduleId],
    });
  };

  return { schedules, scheduleVaccination, recordVaccination, address };
}

