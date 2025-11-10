import { type Address } from 'viem';

export interface EquipmentLease {
  id: bigint;
  lessor: Address;
  lessee: Address;
  equipmentId: bigint;
  monthlyRent: bigint;
  startDate: bigint;
  endDate: bigint;
  status: 'active' | 'expired' | 'cancelled';
  txHash: string;
}

export function createLease(
  lessor: Address,
  lessee: Address,
  equipmentId: bigint,
  monthlyRent: bigint,
  startDate: bigint,
  endDate: bigint
): EquipmentLease {
  return {
    id: BigInt(Date.now()),
    lessor,
    lessee,
    equipmentId,
    monthlyRent,
    startDate,
    endDate,
    status: 'active',
    txHash: '',
  };
}

export function isLeaseActive(
  lease: EquipmentLease,
  currentTime: bigint
): boolean {
  return (
    lease.status === 'active' &&
    currentTime >= lease.startDate &&
    currentTime <= lease.endDate
  );
}

export function calculateTotalRent(
  lease: EquipmentLease,
  currentTime: bigint
): bigint {
  if (currentTime < lease.startDate) return BigInt(0);
  const months = Number((currentTime - lease.startDate) / BigInt(30 * 24 * 60 * 60 * 1000));
  return lease.monthlyRent * BigInt(Math.max(1, months));
}
