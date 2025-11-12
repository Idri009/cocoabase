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

export function calculateItemValue(item: InventoryItem): bigint {
  return item.quantity * item.unitPrice;
}

export function calculateTotalInventoryValue(
  items: InventoryItem[]
): bigint {
  return items.reduce(
    (total, item) => total + calculateItemValue(item),
    BigInt(0)
  );
}

export function getItemsByName(
  items: InventoryItem[],
  itemName: string
): InventoryItem[] {
  return items.filter((i) => i.itemName === itemName);
}
