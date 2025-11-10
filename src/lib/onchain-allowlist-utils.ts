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
