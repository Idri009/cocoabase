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
