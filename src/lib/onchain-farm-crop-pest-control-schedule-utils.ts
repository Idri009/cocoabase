import { type Address } from 'viem';

/**
 * Onchain farm crop pest control schedule utilities
 * Pest control schedule creation and treatment execution
 */

export interface PestControlSchedule {
  id: string;
  plantationId: string;
  createdBy: Address;
  treatmentType: string;
  scheduledDate: bigint;
  targetPest: string;
  executed: boolean;
  timestamp: bigint;
}

export function createPestControlSchedule(
  address: Address,
  plantationId: string,
  treatmentType: string,
  scheduledDate: bigint,
  targetPest: string
): PestControlSchedule {
  return {
    id: `${Date.now()}-${Math.random()}`,
    plantationId,
    createdBy: address,
    treatmentType,
    scheduledDate,
    targetPest,
    executed: false,
    timestamp: BigInt(Date.now()),
  };
}

