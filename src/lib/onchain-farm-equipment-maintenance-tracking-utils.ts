import { type Address } from 'viem';

/**
 * Onchain farm equipment maintenance tracking utilities
 * Maintenance record creation and completion
 */

export interface MaintenanceRecord {
  id: string;
  equipmentId: string;
  recordedBy: Address;
  maintenanceType: string;
  cost: bigint;
  nextMaintenanceDate: bigint;
  completed: boolean;
  timestamp: bigint;
}

export function createMaintenanceRecord(
  address: Address,
  equipmentId: string,
  maintenanceType: string,
  cost: bigint,
  nextMaintenanceDate: bigint
): MaintenanceRecord {
  return {
    id: `${Date.now()}-${Math.random()}`,
    equipmentId,
    recordedBy: address,
    maintenanceType,
    cost,
    nextMaintenanceDate,
    completed: false,
    timestamp: BigInt(Date.now()),
  };
}

