import { useState } from 'react';
import { useAccount } from 'wagmi';
import type { Address } from 'viem';
import {
  createVestingSchedule,
  type VestingSchedule,
} from '@/lib/onchain-vesting-utils';

export function useOnchainVesting() {
  const { address } = useAccount();
  const [schedules, setSchedules] = useState<VestingSchedule[]>([]);

  const createSchedule = async (
    beneficiary: Address,
    amount: bigint,
    duration: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected');
    console.log('Creating vesting schedule:', { beneficiary, amount, duration });
  };

  return { schedules, createSchedule, address };
}

