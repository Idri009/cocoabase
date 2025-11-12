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
