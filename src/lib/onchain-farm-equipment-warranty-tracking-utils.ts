import { type Address } from 'viem';

export interface WarrantyRecord {
  id: bigint;
  owner: Address;
  equipmentId: bigint;
  warrantyProvider: string;
  startDate: bigint;
  endDate: bigint;
  status: 'active' | 'expired' | 'claimed';
  txHash: string;
}

export function registerWarranty(
  owner: Address,
  equipmentId: bigint,
  warrantyProvider: string,
  endDate: bigint
): WarrantyRecord {
  return {
    id: BigInt(Date.now()),
    owner,
    equipmentId,
    warrantyProvider,
    startDate: BigInt(Date.now()),
    endDate,
    status: 'active',
    txHash: '',
  };
}

export function claimWarranty(
  warranty: WarrantyRecord
): WarrantyRecord {
  return {
    ...warranty,
    status: 'claimed',
  };
}

export function getActiveWarranties(
  warranties: WarrantyRecord[]
): WarrantyRecord[] {
  return warranties.filter((w) => w.status === 'active');
}

export function checkWarrantyExpiry(
  warranty: WarrantyRecord,
  currentTime: bigint
): boolean {
  return currentTime > warranty.endDate;
}
