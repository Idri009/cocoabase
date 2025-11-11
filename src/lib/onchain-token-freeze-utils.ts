import { type Address } from 'viem';

export interface TokenFreeze {
  id: bigint;
  token: Address;
  frozen: Set<Address>;
  enabled: boolean;
}

export function createTokenFreeze(token: Address): TokenFreeze {
  return {
    id: BigInt(0),
    token,
    frozen: new Set(),
    enabled: true,
  };
}

export function freezeAddress(
  freeze: TokenFreeze,
  address: Address
): TokenFreeze {
  const newFrozen = new Set(freeze.frozen);
  newFrozen.add(address);
  return {
    ...freeze,
    frozen: newFrozen,
  };
}

export function unfreezeAddress(
  freeze: TokenFreeze,
  address: Address
): TokenFreeze {
  const newFrozen = new Set(freeze.frozen);
  newFrozen.delete(address);
  return {
    ...freeze,
    frozen: newFrozen,
  };
}

export function isFrozen(freeze: TokenFreeze, address: Address): boolean {
  if (!freeze.enabled) return false;
  return freeze.frozen.has(address);
}
