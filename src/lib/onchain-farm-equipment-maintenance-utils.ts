import { type Address } from 'viem';

/**
 * Onchain farm equipment maintenance utilities
 * Equipment maintenance scheduling and tracking
 */

export interface MaintenanceRecord {
  id: string;
  equipmentId: bigint;
  equipmentType: string;
  scheduledDate: bigint;
  completedDate?: bigint;
  maintenanceType: string;
  description: string;
  maintainer: Address;
  completed: boolean;
  cost: bigint;
}

export function createMaintenanceRecord(
  address: Address,
  equipmentId: bigint,
  equipmentType: string,
  scheduledDate: bigint,
  maintenanceType: string,
  description: string,
  cost: bigint
): MaintenanceRecord {
  return {
    id: `${Date.now()}-${Math.random()}`,
    equipmentId,
    equipmentType,
    scheduledDate,
    maintenanceType,
    description,
    maintainer: address,
    completed: false,
    cost,
  };
}

