import { type Address } from 'viem';

export interface MaintenanceRecord {
  id: bigint;
  recorder: Address;
  equipmentId: bigint;
  cost: bigint;
  technician: string;
  timestamp: bigint;
}

export function createMaintenanceRecord(
  recorder: Address,
  equipmentId: bigint,
  cost: bigint,
  technician: string
): MaintenanceRecord {
  return {
    id: BigInt(0),
    recorder,
    equipmentId,
    cost,
    technician,
    timestamp: BigInt(Date.now()),
  };
}

export function getMaintenanceByEquipment(
  records: MaintenanceRecord[],
  equipmentId: bigint
): MaintenanceRecord[] {
  return records.filter((r) => r.equipmentId === equipmentId);
}

export function calculateTotalCost(records: MaintenanceRecord[]): bigint {
  return records.reduce((total, r) => total + r.cost, BigInt(0));
}

export function getRecentMaintenance(
  records: MaintenanceRecord[],
  days: number
): MaintenanceRecord[] {
  const cutoff = BigInt(Date.now() - days * 24 * 60 * 60 * 1000);
  return records.filter((r) => r.timestamp >= cutoff);
}
