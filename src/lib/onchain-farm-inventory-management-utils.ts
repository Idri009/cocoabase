import { type Address } from 'viem';

export interface InventoryItem {
  id: string;
  itemId: bigint;
  itemName: string;
  category: string;
  quantity: bigint;
  unitPrice: bigint;
  manager: Address;
  lastUpdated: bigint;
}

export function createInventoryItem(
  address: Address,
  itemName: string,
  category: string,
  quantity: bigint,
  unitPrice: bigint
): InventoryItem {
  return {
    id: `${Date.now()}-${Math.random()}`,
    itemId: BigInt(0),
    itemName,
    category,
    quantity,
    unitPrice,
    manager: address,
    lastUpdated: BigInt(Date.now()),
  };
}
