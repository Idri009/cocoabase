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
