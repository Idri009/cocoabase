import { type Address } from 'viem';

/**
 * Onchain farm labor contracts utilities
 * Labor contract management and payment tracking
 */

export interface LaborContract {
  id: string;
  contractId: bigint;
  employer: Address;
  worker: Address;
  startDate: bigint;
  endDate: bigint;
  wagePerDay: bigint;
  role: string;
  terms: string;
  active: boolean;
  totalPaid: bigint;
}

export function createLaborContract(
  employer: Address,
  worker: Address,
  contractId: bigint,
  startDate: bigint,
  endDate: bigint,
  wagePerDay: bigint,
  role: string,
  terms: string
): LaborContract {
  return {
    id: `${Date.now()}-${Math.random()}`,
    contractId,
    employer,
    worker,
    startDate,
    endDate,
    wagePerDay,
    role,
    terms,
    active: true,
    totalPaid: BigInt(0),
  };
}

