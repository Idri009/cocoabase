import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createTokenLock,
  unlockTokens,
  extendLock,
  isLocked,
  type TokenLock,
} from '@/lib/onchain-token-lock-utils';

export function useOnchainTokenLock() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [locks, setLocks] = useState<TokenLock[]>([]);
  const [isLocking, setIsLocking] = useState(false);

  const lock = async (
    token: Address,
    amount: bigint,
    unlockTime: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    setIsLocking(true);
    try {
      const lock = createTokenLock(address, token, amount, unlockTime);
      console.log('Locking tokens:', lock);
    } finally {
      setIsLocking(false);
    }
  };

  return {
    locks,
    lock,
    unlockTokens,
    extendLock,
    isLocked,
    isLocking,
    address,
  };
}
