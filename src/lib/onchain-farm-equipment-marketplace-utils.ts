import { type Address } from 'viem';

export interface EquipmentListing {
  id: bigint;
  seller: Address;
  equipmentName: string;
  price: bigint;
  condition: 'new' | 'used' | 'refurbished';
  listingDate: bigint;
  status: 'available' | 'sold' | 'cancelled';
  txHash: string;
}

export function listEquipment(
  seller: Address,
  equipmentName: string,
  price: bigint,
  condition: EquipmentListing['condition']
): EquipmentListing {
  return {
    id: BigInt(Date.now()),
    seller,
    equipmentName,
    price,
    condition,
    listingDate: BigInt(Date.now()),
    status: 'available',
    txHash: '',
  };
}

export function purchaseEquipment(
  listing: EquipmentListing,
  buyer: Address
): EquipmentListing | null {
  if (listing.status !== 'available') return null;
  return {
    ...listing,
    status: 'sold',
  };
}

export function getAvailableEquipment(
  listings: EquipmentListing[]
): EquipmentListing[] {
  return listings.filter((l) => l.status === 'available');
}

export function getEquipmentByCondition(
  listings: EquipmentListing[],
  condition: EquipmentListing['condition']
): EquipmentListing[] {
  return listings.filter((l) => l.condition === condition);
}
