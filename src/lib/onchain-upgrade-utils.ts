import { type Address } from 'viem';

export interface Upgrade {
  id: bigint;
  contract: Address;
  newImplementation: Address;
  upgradedBy: Address;
  timestamp: bigint;
}

export function createUpgrade(
  contract: Address,
  newImplementation: Address,
  upgradedBy: Address
): Upgrade {
  return {
    id: BigInt(0),
    contract,
    newImplementation,
    upgradedBy,
    timestamp: BigInt(Date.now()),
  };
}

export function validateUpgrade(
  upgrade: Upgrade,
  authorized: Address
): boolean {
  return upgrade.upgradedBy === authorized;
}

export function getUpgradeHistory(
  upgrades: Upgrade[],
  contract: Address
): Upgrade[] {
  return upgrades.filter((u) => u.contract === contract);
}
