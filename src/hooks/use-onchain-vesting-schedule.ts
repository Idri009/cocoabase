import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createVestingSchedule,
  releaseVested,
  calculateVestedAmount,
  type VestingSchedule,
} from '@/lib/onchain-vesting-schedule-utils';

export function useOnchainVestingSchedule() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [schedules, setSchedules] = useState<VestingSchedule[]>([]);
  const [isReleasing, setIsReleasing] = useState(false);

  const release = async (scheduleId: bigint): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    setIsReleasing(true);
    try {
      const currentTime = BigInt(Date.now());
      const schedule = schedules.find((s) => s.id === scheduleId);
      if (!schedule) throw new Error('Schedule not found');
      const { released } = releaseVested(schedule, currentTime);
      console.log('Releasing vested tokens:', { scheduleId, released });
    } finally {
      setIsReleasing(false);
    }
  };

  return {
    schedules,
    release,
    calculateVestedAmount,
    isReleasing,
    address,
  };
}

