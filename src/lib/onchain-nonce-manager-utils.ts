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

export function getNextNonce(manager: NonceManager): {
  manager: NonceManager;
  nonce: bigint;
} {
  const nextNonce = manager.nonce + BigInt(1);
  const newUsed = new Set(manager.usedNonces);
  newUsed.add(nextNonce);
  return {
    manager: {
      ...manager,
      nonce: nextNonce,
      usedNonces: newUsed,
    },
    nonce: nextNonce,
  };
}

export function isNonceUsed(manager: NonceManager, nonce: bigint): boolean {
  return manager.usedNonces.has(nonce);
}
