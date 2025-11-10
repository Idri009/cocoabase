import { type Address } from 'viem';

export interface IrrigationSchedule {
  id: bigint;
  owner: Address;
  plantationId: bigint;
  scheduledDate: bigint;
  waterAmount: bigint;
  status: 'scheduled' | 'completed' | 'cancelled';
  txHash: string;
}

export function scheduleIrrigation(
  owner: Address,
  plantationId: bigint,
  scheduledDate: bigint,
  waterAmount: bigint
): IrrigationSchedule {
  return {
    id: BigInt(Date.now()),
    owner,
    plantationId,
    scheduledDate,
    waterAmount,
    status: 'scheduled',
    txHash: '',
  };
}

export function completeIrrigation(
  schedule: IrrigationSchedule
): IrrigationSchedule {
  return {
    ...schedule,
    status: 'completed',
  };
}

export function getTotalWaterScheduled(
  schedules: IrrigationSchedule[]
): bigint {
  return schedules
    .filter((s) => s.status === 'scheduled')
    .reduce((total, s) => total + s.waterAmount, BigInt(0));
}
