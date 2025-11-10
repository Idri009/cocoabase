import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createMultisigWallet,
  addTransaction,
  signTransaction,
  canExecuteTransaction,
  type MultisigWallet,
} from '@/lib/onchain-multisig-wallet-utils';

export function useOnchainMultisigWallet() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [wallets, setWallets] = useState<MultisigWallet[]>([]);
  const [isCreating, setIsCreating] = useState(false);

  const createWallet = async (
    owners: Address[],
    threshold: number
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    setIsCreating(true);
    try {
      const wallet = createMultisigWallet(owners, threshold);
      console.log('Creating multisig wallet:', wallet);
    } finally {
      setIsCreating(false);
    }
  };

  return {
    wallets,
    createWallet,
    addTransaction,
    signTransaction,
    canExecuteTransaction,
    isCreating,
    address,
  };
}

