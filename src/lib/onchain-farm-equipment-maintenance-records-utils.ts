import { type Address } from 'viem';

export interface MaintenanceRecord {
  id: bigint;
  recorder: Address;
  equipment: string;
  cost: bigint;
  technician: Address;
  timestamp: bigint;
}

export function createMaintenanceRecord(
  recorder: Address,
  equipment: string,
  cost: bigint,
  technician: Address
): MaintenanceRecord {
  return {
    id: BigInt(0),
    recorder,
    equipment,
    cost,
    technician,
    timestamp: BigInt(Date.now()),
  };
}

export function getMaintenanceByEquipment(
  records: MaintenanceRecord[],
  equipment: string
): MaintenanceRecord[] {
  return records.filter((r) => r.equipment === equipment);
}

export function calculateTotalCost(records: MaintenanceRecord[]): bigint {
  return records.reduce((total, r) => total + r.cost, BigInt(0));
}

export function getRecentMaintenance(
  records: MaintenanceRecord[],
  days: number
): MaintenanceRecord[] {
  const cutoff = BigInt(Date.now()) - BigInt(days * 24 * 60 * 60 * 1000);
  return records.filter((r) => r.timestamp >= cutoff);
}

}
