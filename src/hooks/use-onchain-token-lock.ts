import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createTokenLock,
  unlockTokens,
  isLocked,
  getTimeUntilUnlock,
  type TokenLock,
} from '@/lib/onchain-token-lock-utils';

export function useOnchainTokenLock() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [locks, setLocks] = useState<TokenLock[]>([]);
  const [isUnlocking, setIsUnlocking] = useState(false);

  const unlock = async (lockId: bigint): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    setIsUnlocking(true);
    try {
      const currentTime = BigInt(Date.now());
      const lock = locks.find((l) => l.id === lockId);
      if (!lock) throw new Error('Lock not found');
      const updated = unlockTokens(lock, currentTime);
      if (updated) {
        console.log('Unlocking tokens:', { lockId });
      }
    } finally {
      setIsUnlocking(false);
    }
  };

  return {
    locks,
    unlock,
    isLocked,
    getTimeUntilUnlock,
    isUnlocking,
    address,
  };
}

