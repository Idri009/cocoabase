import { useState } from 'react';
import { useAccount } from 'wagmi';
import type { Address } from 'viem';
import {
  recordCheckIn,
  type WorkerAttendance,
} from '@/lib/onchain-farm-worker-attendance-utils';

export function useOnchainFarmWorkerAttendance() {
  const { address } = useAccount();
  const [attendance, setAttendance] = useState<WorkerAttendance[]>([]);

  const checkIn = async (
    workerAddress: Address,
    workDate: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected');
    const record = recordCheckIn(address, workerAddress, workDate);
    setAttendance([...attendance, record]);
  };

  return { attendance, checkIn, address };
}
