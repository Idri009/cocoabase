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

export function unlockTokens(
  lock: TokenLock,
  currentTime: bigint
): TokenLock | null {
  if (!lock.locked) return null;
  if (currentTime < lock.unlockTime) return null;
  return {
    ...lock,
    locked: false,
  };
}

export function extendLock(
  lock: TokenLock,
  newUnlockTime: bigint
): TokenLock | null {
  if (!lock.locked) return null;
  if (newUnlockTime <= lock.unlockTime) return null;
  return {
    ...lock,
    unlockTime: newUnlockTime,
  };
}

export function isLocked(lock: TokenLock, currentTime: bigint): boolean {
  return lock.locked && currentTime < lock.unlockTime;
}
