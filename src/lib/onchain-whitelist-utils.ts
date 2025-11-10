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

