import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createJob,
  fillJob,
  getOpenJobs,
  calculateTotalWages,
  type LaborJob,
} from '@/lib/onchain-farm-labor-marketplace-utils';

export function useOnchainFarmLaborMarketplace() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [jobs, setJobs] = useState<LaborJob[]>([]);
  const [isFilling, setIsFilling] = useState(false);

  const fill = async (jobId: bigint): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    setIsFilling(true);
    try {
      const job = jobs.find((j) => j.id === jobId);
      if (!job) throw new Error('Job not found');
      const updated = fillJob(job, address);
      console.log('Filling job:', { jobId });
    } finally {
      setIsFilling(false);
    }
  };

  return {
    jobs,
    fill,
    getOpenJobs,
    calculateTotalWages,
    isFilling,
    address,
  };
}
