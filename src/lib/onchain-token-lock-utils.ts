import { type Address } from 'viem';

export interface TokenLock {
  id: bigint;
  locker: Address;
  token: Address;
  amount: bigint;
  unlockTime: bigint;
  locked: boolean;
}

export function createTokenLock(
  locker: Address,
  token: Address,
  amount: bigint,
  unlockTime: bigint
): TokenLock {
  return {
    id: BigInt(0),
    locker,
    token,
    amount,
    unlockTime,
    locked: true,
  };
}
