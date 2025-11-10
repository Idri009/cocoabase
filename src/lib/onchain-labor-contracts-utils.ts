import { type Address } from 'viem';

export interface LaborContract {
  id: bigint;
  employer: Address;
  worker: Address;
  role: string;
  hourlyRate: bigint;
  startDate: bigint;
  endDate: bigint;
  status: 'active' | 'completed' | 'terminated';
  txHash: string;
}

export function createLaborContract(
  employer: Address,
  worker: Address,
  role: string,
  hourlyRate: bigint,
  startDate: bigint,
  endDate: bigint
): LaborContract {
  return {
    id: BigInt(Date.now()),
    employer,
    worker,
    role,
    hourlyRate,
    startDate,
    endDate,
    status: 'active',
    txHash: '',
  };
}
