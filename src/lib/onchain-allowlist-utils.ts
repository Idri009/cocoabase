import { type Address } from 'viem';

export interface Allowlist {
  id: bigint;
  name: string;
  addresses: Set<Address>;
  merkleRoot: string;
  maxSize: number;
}

export function createAllowlist(
  name: string,
  merkleRoot: string,
  maxSize: number
): Allowlist {
  return {
    id: BigInt(0),
    name,
    addresses: new Set(),
    merkleRoot,
    maxSize,
  };
}

export function addToAllowlist(
  allowlist: Allowlist,
  address: Address
): Allowlist | null {
  if (allowlist.addresses.size >= allowlist.maxSize) return null;
  const newAddresses = new Set(allowlist.addresses);
  newAddresses.add(address);
  return {
    ...allowlist,
    addresses: newAddresses,
  };
}

export function removeFromAllowlist(
  allowlist: Allowlist,
  address: Address
): Allowlist {
  const newAddresses = new Set(allowlist.addresses);
  newAddresses.delete(address);
  return {
    ...allowlist,
    addresses: newAddresses,
  };
}

export function isAllowed(
  allowlist: Allowlist,
  address: Address
): boolean {
  return allowlist.addresses.has(address);
}
