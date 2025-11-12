import { type Address } from 'viem';

export interface InventoryValuation {
  id: bigint;
  owner: Address;
  itemId: bigint;
  quantity: bigint;
  unitPrice: bigint;
  totalValue: bigint;
  valuationDate: bigint;
  txHash: string;
}

export function createValuation(
  owner: Address,
  itemId: bigint,
  quantity: bigint,
  unitPrice: bigint
): InventoryValuation {
  return {
    id: BigInt(Date.now()),
    owner,
    itemId,
    quantity,
    unitPrice,
    totalValue: quantity * unitPrice,
    valuationDate: BigInt(Date.now()),
    txHash: '',
  };
}

export function getTotalInventoryValue(
  valuations: InventoryValuation[]
): bigint {
  return valuations.reduce((total, v) => total + v.totalValue, BigInt(0));
}

export function getValuationsByItem(
  valuations: InventoryValuation[],
  itemId: bigint
): InventoryValuation[] {
  return valuations.filter((v) => v.itemId === itemId);
}

export function updateValuation(
  valuation: InventoryValuation,
  newUnitPrice: bigint
): InventoryValuation {
  return {
    ...valuation,
    unitPrice: newUnitPrice,
    totalValue: valuation.quantity * newUnitPrice,
  };
}
