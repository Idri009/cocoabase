import { type Address } from 'viem';

export interface LaborJob {
  id: bigint;
  employer: Address;
  jobTitle: string;
  wage: bigint;
  duration: bigint;
  status: 'open' | 'filled' | 'cancelled';
}

export function createJob(
  employer: Address,
  jobTitle: string,
  wage: bigint,
  duration: bigint
): LaborJob {
  return {
    id: BigInt(0),
    employer,
    jobTitle,
    wage,
    duration,
    status: 'open',
  };
}

export function fillJob(job: LaborJob, worker: Address): LaborJob {
  return {
    ...job,
    status: 'filled',
  };
}

export function getOpenJobs(jobs: LaborJob[]): LaborJob[] {
  return jobs.filter((j) => j.status === 'open');
}

export function calculateTotalWages(jobs: LaborJob[]): bigint {
  return jobs.reduce((total, job) => total + job.wage * job.duration, BigInt(0));
}
