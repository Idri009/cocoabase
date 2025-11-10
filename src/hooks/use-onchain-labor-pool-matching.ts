import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createWorkerProfile,
  createJobPosting,
  matchWorkerToJob,
  hireWorker,
  calculateJobCost,
  type WorkerProfile,
  type JobPosting,
} from '@/lib/onchain-labor-pool-matching-utils';

/**
 * Hook for onchain labor pool matching operations
 * Requires Reown wallet connection via useAccount
 */
export function useOnchainLaborPoolMatching() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [workers, setWorkers] = useState<WorkerProfile[]>([]);
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [isCreatingProfile, setIsCreatingProfile] = useState(false);
  const [isPostingJob, setIsPostingJob] = useState(false);

  const createProfile = async (
    name: string,
    skills: string[],
    experience: number,
    hourlyRate: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    setIsCreatingProfile(true);
    try {
      const profile = createWorkerProfile(address, name, skills, experience, hourlyRate);
      setWorkers((prev) => [...prev, profile]);
      console.log('Creating worker profile:', profile);
      // Onchain profile creation via smart contract
      await writeContract({
        address: '0x0000000000000000000000000000000000000000' as Address,
        abi: [],
        functionName: 'createWorkerProfile',
        args: [name, skills, experience, hourlyRate],
      });
    } finally {
      setIsCreatingProfile(false);
    }
  };

  const postJob = async (
    title: string,
    description: string,
    requiredSkills: string[],
    hourlyRate: bigint,
    duration: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    setIsPostingJob(true);
    try {
      const job = createJobPosting(
        address,
        title,
        description,
        requiredSkills,
        hourlyRate,
        duration
      );
      setJobs((prev) => [...prev, job]);
      console.log('Posting job:', job);
      // Onchain job posting via smart contract
      await writeContract({
        address: '0x0000000000000000000000000000000000000000' as Address,
        abi: [],
        functionName: 'postJob',
        args: [title, description, requiredSkills, hourlyRate, duration],
      });
    } finally {
      setIsPostingJob(false);
    }
  };

  const hireWorkerForJob = async (
    jobId: bigint,
    workerAddress: Address
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    try {
      const job = jobs.find((j) => j.id === jobId);
      if (!job) throw new Error('Job not found');
      const worker = workers.find((w) => w.address === workerAddress);
      if (!worker) throw new Error('Worker not found');
      
      if (matchWorkerToJob(worker, job)) {
        const updated = hireWorker(job, workerAddress);
        setJobs((prev) =>
          prev.map((j) => (j.id === jobId ? updated : j))
        );
        console.log('Hiring worker for job:', { jobId, workerAddress });
        // Onchain hiring via smart contract
        await writeContract({
          address: '0x0000000000000000000000000000000000000000' as Address,
          abi: [],
          functionName: 'hireWorker',
          args: [jobId, workerAddress],
        });
      }
    } finally {
      // Hiring complete
    }
  };

  return {
    workers,
    jobs,
    createProfile,
    postJob,
    hireWorkerForJob,
    matchWorkerToJob,
    calculateJobCost,
    isCreatingProfile,
    isPostingJob,
    address,
  };
}

