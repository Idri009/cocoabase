import { type Address } from 'viem';

export interface NonceManager {
  id: bigint;
  address: Address;
  nonce: bigint;
  usedNonces: Set<bigint>;
}

export function createNonceManager(address: Address): NonceManager {
  return {
    id: BigInt(0),
    address,
    nonce: BigInt(0),
    usedNonces: new Set(),
  };
}

