import { type Address } from 'viem';

export interface EquipmentInventory {
  id: bigint;
  owner: Address;
  equipmentName: string;
  quantity: bigint;
  location: string;
  status: 'available' | 'in-use' | 'maintenance';
  txHash: string;
}

export function addEquipment(
  owner: Address,
  equipmentName: string,
  quantity: bigint,
  location: string
): EquipmentInventory {
  return {
    id: BigInt(Date.now()),
    owner,
    equipmentName,
    quantity,
    location,
    status: 'available',
    txHash: '',
  };
}
