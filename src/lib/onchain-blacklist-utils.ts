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

