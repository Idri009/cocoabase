import { type Address } from 'viem';

export interface LaborContract {
  id: bigint;
  employer: Address;
  worker: Address;
  wage: bigint;
  duration: bigint;
  status: 'active' | 'completed' | 'terminated';
  timestamp: bigint;
}

export function createLaborContract(
  employer: Address,
  worker: Address,
  wage: bigint,
  duration: bigint
): LaborContract {
  return {
    id: BigInt(Date.now()),
    employer,
    worker,
    wage,
    duration,
    status: 'active',
    timestamp: BigInt(Date.now()),
  };
}

export function calculateTotalWage(
  contract: LaborContract
): bigint {
  return contract.wage * contract.duration;
}

export function getActiveContracts(
  contracts: LaborContract[]
): LaborContract[] {
  return contracts.filter((c) => c.status === 'active');
}
