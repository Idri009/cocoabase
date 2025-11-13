import { type Address } from 'viem';

export interface SeedInventory {
  id: bigint;
  owner: Address;
  seedType: string;
  quantity: bigint;
  expiryDate: bigint;
  timestamp: bigint;
}

export function createSeedInventory(
  owner: Address,
  seedType: string,
  quantity: bigint,
  expiryDate: bigint
): SeedInventory {
  return {
    id: BigInt(Date.now()),
    owner,
    seedType,
    quantity,
    expiryDate,
    timestamp: BigInt(Date.now()),
  };
}
