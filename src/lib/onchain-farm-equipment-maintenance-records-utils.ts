import { type Address } from 'viem';

export interface MaintenanceRecord {
  id: bigint;
  owner: Address;
  equipmentId: bigint;
  maintenanceType: string;
  cost: bigint;
  maintenanceDate: bigint;
  technician: Address;
  txHash: string;
}

export function recordMaintenance(
  owner: Address,
  equipmentId: bigint,
  maintenanceType: string,
  cost: bigint,
  technician: Address
): MaintenanceRecord {
  return {
    id: BigInt(Date.now()),
    owner,
    equipmentId,
    maintenanceType,
    cost,
    maintenanceDate: BigInt(Date.now()),
    technician,
    txHash: '',
  };
}

export function getMaintenanceByEquipment(
  records: MaintenanceRecord[],
  equipmentId: bigint
): MaintenanceRecord[] {
  return records
    .filter((r) => r.equipmentId === equipmentId)
    .sort((a, b) => (a.maintenanceDate > b.maintenanceDate ? -1 : 1));
}

export function getTotalMaintenanceCost(
  records: MaintenanceRecord[]
): bigint {
  return records.reduce((total, r) => total + r.cost, BigInt(0));
}

export function getRecentMaintenance(
  records: MaintenanceRecord[],
  days: number
): MaintenanceRecord[] {
  const cutoff = BigInt(Date.now() - days * 24 * 60 * 60 * 1000);
  return records.filter((r) => r.maintenanceDate >= cutoff);
}
