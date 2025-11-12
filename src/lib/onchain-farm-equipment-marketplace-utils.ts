import { type Address } from 'viem';

export interface EquipmentListing {
  id: bigint;
  seller: Address;
  equipment: string;
  condition: 'new' | 'used' | 'refurbished';
  price: bigint;
  available: boolean;
}

export function createEquipmentListing(
  seller: Address,
  equipment: string,
  condition: 'new' | 'used' | 'refurbished',
  price: bigint
): EquipmentListing {
  return {
    id: BigInt(0),
    seller,
    equipment,
    condition,
    price,
    available: true,
  };
}

export function purchaseEquipment(
  listing: EquipmentListing,
  buyer: Address
): EquipmentListing {
  return {
    ...listing,
    available: false,
  };
}

export function getAvailableEquipment(
  listings: EquipmentListing[]
): EquipmentListing[] {
  return listings.filter((l) => l.available);
}

export function getEquipmentByCondition(
  listings: EquipmentListing[],
  condition: 'new' | 'used' | 'refurbished'
): EquipmentListing[] {
  return listings.filter((l) => l.condition === condition);
}
