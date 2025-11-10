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

export function updateSeedQuantity(
  inventory: SeedInventory,
  newQuantity: bigint
): SeedInventory {
  return {
    ...inventory,
    quantity: newQuantity,
  };
}

export function getExpiringSeeds(
  inventory: SeedInventory[],
  currentTime: bigint,
  daysThreshold: number
): SeedInventory[] {
  const threshold = BigInt(daysThreshold * 24 * 60 * 60 * 1000);
  return inventory.filter((s) => {
    const timeUntilExpiry = s.expiryDate - currentTime;
    return timeUntilExpiry > BigInt(0) && timeUntilExpiry <= threshold;
  });
}

export function getTotalSeedQuantity(
  inventory: SeedInventory[],
  seedType: string
): bigint {
  return inventory
    .filter((s) => s.seedType === seedType)
    .reduce((total, s) => total + s.quantity, BigInt(0));
}
