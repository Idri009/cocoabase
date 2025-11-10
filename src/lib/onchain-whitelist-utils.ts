import { type Address } from 'viem';

export interface Whitelist {
  id: bigint;
  name: string;
  addresses: Set<Address>;
  enabled: boolean;
}

export function createWhitelist(name: string): Whitelist {
  return {
    id: BigInt(0),
    name,
    addresses: new Set(),
    enabled: true,
  };
}

export function addToWhitelist(
  whitelist: Whitelist,
  address: Address
): Whitelist {
  const newAddresses = new Set(whitelist.addresses);
  newAddresses.add(address);
  return {
    ...whitelist,
    addresses: newAddresses,
  };
}

export function removeFromWhitelist(
  whitelist: Whitelist,
  address: Address
): Whitelist {
  const newAddresses = new Set(whitelist.addresses);
  newAddresses.delete(address);
  return {
    ...whitelist,
    addresses: newAddresses,
  };
}

export function isWhitelisted(
  whitelist: Whitelist,
  address: Address
): boolean {
  if (!whitelist.enabled) return true;
  return whitelist.addresses.has(address);
}
