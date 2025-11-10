import { type Address } from 'viem';

export interface SeedInventory {
  id: bigint;
  owner: Address;
  seedType: string;
  quantity: bigint;
  unit: string;
  purchaseDate: bigint;
  expiryDate: bigint;
  txHash: string;
}

export function addSeedToInventory(
  owner: Address,
  seedType: string,
  quantity: bigint,
  unit: string,
  expiryDate: bigint
): SeedInventory {
  return {
    id: BigInt(Date.now()),
    owner,
    seedType,
    quantity,
    unit,
    purchaseDate: BigInt(Date.now()),
    expiryDate,
    txHash: '',
  };
}
