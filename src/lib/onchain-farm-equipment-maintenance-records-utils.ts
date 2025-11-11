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
