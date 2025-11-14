import { type Address } from 'viem';

export interface HarvestSchedule {
  id: string;
  scheduleId: bigint;
  plantationId: bigint;
  scheduledDate: bigint;
  expectedYield: bigint;
  scheduler: Address;
  completed: boolean;
  actualYield?: bigint;
}

export function createHarvestSchedule(
  address: Address,
  plantationId: bigint,
  scheduledDate: bigint,
  expectedYield: bigint
): HarvestSchedule {
  return {
    id: `${Date.now()}-${Math.random()}`,
    scheduleId: BigInt(0),
    plantationId,
    scheduledDate,
    expectedYield,
    scheduler: address,
    completed: false,
  };
}
