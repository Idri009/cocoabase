import { type Address } from 'viem';

/**
 * Onchain farm irrigation scheduling utilities
 * Irrigation schedule creation and execution
 */

export interface IrrigationSchedule {
  id: string;
  plantationId: string;
  createdBy: Address;
  startTime: bigint;
  duration: number;
  waterAmount: bigint;
  executed: boolean;
  timestamp: bigint;
}

export function createIrrigationSchedule(
  address: Address,
  plantationId: string,
  startTime: bigint,
  duration: number,
  waterAmount: bigint
): IrrigationSchedule {
  return {
    id: `${Date.now()}-${Math.random()}`,
    plantationId,
    createdBy: address,
    startTime,
    duration,
    waterAmount,
    executed: false,
    timestamp: BigInt(Date.now()),
  };
}

