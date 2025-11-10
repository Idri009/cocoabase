import { type Address } from 'viem';

export interface EquipmentRental {
  id: bigint;
  owner: Address;
  renter: Address;
  equipmentType: string;
  dailyRate: bigint;
  startDate: bigint;
  endDate: bigint;
  status: 'available' | 'rented' | 'returned';
  txHash: string;
}

export function listEquipmentForRental(
  owner: Address,
  equipmentType: string,
  dailyRate: bigint
): EquipmentRental {
  return {
    id: BigInt(Date.now()),
    owner,
    renter: '0x0000000000000000000000000000000000000000' as Address,
    equipmentType,
    dailyRate,
    startDate: BigInt(0),
    endDate: BigInt(0),
    status: 'available',
    txHash: '',
  };
}

export function rentEquipment(
  rental: EquipmentRental,
  renter: Address,
  startDate: bigint,
  endDate: bigint
): EquipmentRental | null {
  if (rental.status !== 'available') return null;
  return {
    ...rental,
    renter,
    startDate,
    endDate,
    status: 'rented',
  };
}

export function getAvailableEquipment(
  rentals: EquipmentRental[]
): EquipmentRental[] {
  return rentals.filter((r) => r.status === 'available');
}

export function calculateRentalCost(
  rental: EquipmentRental,
  days: number
): bigint {
  return rental.dailyRate * BigInt(days);
}
