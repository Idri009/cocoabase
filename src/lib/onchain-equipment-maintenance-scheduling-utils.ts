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

export function completeMaintenance(
  schedule: MaintenanceSchedule
): MaintenanceSchedule {
  return {
    ...schedule,
    status: 'completed',
  };
}

export function getUpcomingMaintenance(
  schedules: MaintenanceSchedule[],
  currentTime: bigint
): MaintenanceSchedule[] {
  return schedules
    .filter((s) => s.status === 'scheduled' && s.scheduledDate >= currentTime)
    .sort((a, b) => (a.scheduledDate > b.scheduledDate ? 1 : -1));
}
