import { type Address } from 'viem';

/**
 * Onchain Labor Pool Matching utilities
 * Match workers with farms onchain
 */

export interface WorkerProfile {
  address: Address;
  name: string;
  skills: string[];
  experience: number;
  hourlyRate: bigint;
  availability: 'available' | 'hired' | 'unavailable';
  rating: number;
  createdAt: bigint;
}

export interface JobPosting {
  id: bigint;
  employer: Address;
  title: string;
  description: string;
  requiredSkills: string[];
  hourlyRate: bigint;
  duration: bigint;
  status: 'open' | 'filled' | 'cancelled';
  createdAt: bigint;
  worker?: Address;
}

export function createWorkerProfile(
  address: Address,
  name: string,
  skills: string[],
  experience: number,
  hourlyRate: bigint
): WorkerProfile {
  const now = BigInt(Date.now());
  return {
    address,
    name,
    skills,
    experience,
    hourlyRate,
    availability: 'available',
    rating: 0,
    createdAt: now,
  };
}

export function createJobPosting(
  employer: Address,
  title: string,
  description: string,
  requiredSkills: string[],
  hourlyRate: bigint,
  duration: bigint
): JobPosting {
  const now = BigInt(Date.now());
  return {
    id: BigInt(0),
    employer,
    title,
    description,
    requiredSkills,
    hourlyRate,
    duration,
    status: 'open',
    createdAt: now,
  };
}

export function matchWorkerToJob(
  worker: WorkerProfile,
  job: JobPosting
): boolean {
  if (worker.availability !== 'available') return false;
  if (job.status !== 'open') return false;
  if (worker.hourlyRate > job.hourlyRate) return false;
  
  const hasRequiredSkills = job.requiredSkills.every(skill =>
    worker.skills.includes(skill)
  );
  return hasRequiredSkills;
}

export function hireWorker(
  job: JobPosting,
  worker: Address
): JobPosting {
  return {
    ...job,
    status: 'filled',
    worker,
  };
}

export function calculateJobCost(
  hourlyRate: bigint,
  duration: bigint
): bigint {
  const hours = duration / BigInt(3600000);
  return hourlyRate * hours;
}

