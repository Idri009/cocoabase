import { type Address } from 'viem';

export interface UtilizationRecord {
  id: bigint;
  owner: Address;
  equipmentId: bigint;
  hoursUsed: number;
  recordDate: bigint;
  utilizationRate: number;
  txHash: string;
}

export function recordUtilization(
  owner: Address,
  equipmentId: bigint,
  hoursUsed: number,
  utilizationRate: number
): UtilizationRecord {
  return {
    id: BigInt(Date.now()),
    owner,
    equipmentId,
    hoursUsed,
    recordDate: BigInt(Date.now()),
    utilizationRate,
    txHash: '',
  };
}

export function getUtilizationByEquipment(
  records: UtilizationRecord[],
  equipmentId: bigint
): UtilizationRecord[] {
  return records.filter((r) => r.equipmentId === equipmentId);
}

export function getAverageUtilizationRate(
  records: UtilizationRecord[]
): number {
  if (records.length === 0) return 0;
  const total = records.reduce((sum, r) => sum + r.utilizationRate, 0);
  return total / records.length;
}

export function getTotalHoursUsed(
  records: UtilizationRecord[]
): number {
  return records.reduce((total, r) => total + r.hoursUsed, 0);
}
