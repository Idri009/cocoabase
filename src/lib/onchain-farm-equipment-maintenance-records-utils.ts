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
