import { type Address } from 'viem';

export interface TokenLock {
  id: bigint;
  owner: Address;
  token: Address;
  amount: bigint;
  unlockTime: bigint;
  status: 'locked' | 'unlocked';
}

export function createTokenLock(
  owner: Address,
  token: Address,
  amount: bigint,
  duration: bigint
): TokenLock {
  const now = BigInt(Date.now());
  return {
    id: BigInt(0),
    owner,
    token,
    amount,
    unlockTime: now + duration,
    status: 'locked',
  };
}

export function unlockTokens(
  lock: TokenLock,
  currentTime: bigint
): TokenLock | null {
  if (lock.status !== 'locked') return null;
  if (currentTime < lock.unlockTime) return null;
  return {
    ...lock,
    status: 'unlocked',
  };
}

export function isLocked(lock: TokenLock, currentTime: bigint): boolean {
  return lock.status === 'locked' && currentTime < lock.unlockTime;
}

export function getTimeUntilUnlock(
  lock: TokenLock,
  currentTime: bigint
): bigint {
  if (lock.unlockTime <= currentTime) return BigInt(0);
  return lock.unlockTime - currentTime;
}
