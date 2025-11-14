import { type Address } from 'viem';

/**
 * Onchain farm labor pool utilities
 * Labor pooling system
 */

export interface Worker {
  workerAddress: Address;
  name: string;
  skills: string;
  hourlyRate: bigint;
  isAvailable: boolean;
  joinDate: bigint;
  rating: bigint;
  totalJobs: bigint;
}

export interface Job {
  id: string;
  jobId: bigint;
  employer: Address;
  jobDescription: string;
  startDate: bigint;
  endDate: bigint;
  hourlyRate: bigint;
  totalHours: bigint;
  isActive: boolean;
  isCompleted: boolean;
  worker: Address;
}

export function createWorker(
  address: Address,
  name: string,
  skills: string,
  hourlyRate: bigint
): Worker {
  return {
    workerAddress: address,
    name,
    skills,
    hourlyRate,
    isAvailable: true,
    joinDate: BigInt(Date.now()),
    rating: BigInt(0),
    totalJobs: BigInt(0),
  };
}

export function createJob(
  address: Address,
  jobDescription: string,
  startDate: bigint,
  endDate: bigint,
  hourlyRate: bigint,
  totalHours: bigint
): Job {
  return {
    id: `${Date.now()}-${Math.random()}`,
    jobId: BigInt(0),
    employer: address,
    jobDescription,
    startDate,
    endDate,
    hourlyRate,
    totalHours,
    isActive: true,
    isCompleted: false,
    worker: address,
  };
}

