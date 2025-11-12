import { useState } from 'react';
import { useAccount } from 'wagmi';
import type { Address } from 'viem';
import {
  createProductivityRecord,
  getRecordsByWorker,
  calculateProductivity,
  getRecentRecords,
  type ProductivityRecord,
} from '@/lib/onchain-farm-labor-productivity-tracking-utils';

export function useOnchainFarmLaborProductivityTracking() {
  const { address } = useAccount();
  const [records, setRecords] = useState<ProductivityRecord[]>([]);

  const record = (
    worker: Address,
    task: string,
    output: bigint,
    hours: bigint
  ) => {
    if (!address) throw new Error('Wallet not connected via Reown');
    const productivityRecord = createProductivityRecord(
      address,
      worker,
      task,
      output,
      hours
    );
    setRecords((prev) => [...prev, productivityRecord]);
    console.log('Recording productivity:', { worker, task, output });
  };

  return {
    records,
    record,
    getRecordsByWorker,
    calculateProductivity,
    getRecentRecords,
    address,
  };
}
