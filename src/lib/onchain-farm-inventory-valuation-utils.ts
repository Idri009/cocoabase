import { type Address } from 'viem';

export interface InventoryItem {
  id: bigint;
  recorder: Address;
  itemName: string;
  quantity: bigint;
  unitPrice: bigint;
  timestamp: bigint;
}

export function createInventoryItem(
  recorder: Address,
  itemName: string,
  quantity: bigint,
  unitPrice: bigint
): InventoryItem {
  return {
    id: BigInt(0),
    recorder,
    itemName,
    quantity,
    unitPrice,
    timestamp: BigInt(Date.now()),
  };
}
