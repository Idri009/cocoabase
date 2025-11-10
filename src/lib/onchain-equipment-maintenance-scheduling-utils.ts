import { type Address } from 'viem';

export interface MaintenanceSchedule {
  id: bigint;
  owner: Address;
  equipmentId: bigint;
  maintenanceType: string;
  scheduledDate: bigint;
  status: 'scheduled' | 'completed' | 'cancelled';
  txHash: string;
}

export function scheduleMaintenance(
  owner: Address,
  equipmentId: bigint,
  maintenanceType: string,
  scheduledDate: bigint
): MaintenanceSchedule {
  return {
    id: BigInt(Date.now()),
    owner,
    equipmentId,
    maintenanceType,
    scheduledDate,
    status: 'scheduled',
    txHash: '',
  };
}
