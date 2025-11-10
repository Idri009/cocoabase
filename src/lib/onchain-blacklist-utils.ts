import { type Address } from 'viem';

export interface Blacklist {
  id: bigint;
  name: string;
  addresses: Set<Address>;
  enabled: boolean;
}

export function createBlacklist(name: string): Blacklist {
  return {
    id: BigInt(0),
    name,
    addresses: new Set(),
    enabled: true,
  };
}

export function addToBlacklist(
  blacklist: Blacklist,
  address: Address
): Blacklist {
  const newAddresses = new Set(blacklist.addresses);
  newAddresses.add(address);
  return {
    ...blacklist,
    addresses: newAddresses,
  };
}

export function isBlacklisted(
  blacklist: Blacklist,
  address: Address
): boolean {
  if (!blacklist.enabled) return false;
  return blacklist.addresses.has(address);
}
