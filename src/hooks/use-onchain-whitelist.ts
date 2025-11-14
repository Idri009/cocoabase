import { useState } from 'react';
import { useAccount } from 'wagmi';
import type { Address } from 'viem';
import {
  createWhitelist,
  addToWhitelist,
  removeFromWhitelist,
  isWhitelisted,
  type Whitelist,
} from '@/lib/onchain-whitelist-utils';

export function useOnchainWhitelist() {
  const { address } = useAccount();
  const [whitelists, setWhitelists] = useState<Whitelist[]>([]);

  const add = (whitelistId: bigint, addressToAdd: Address) => {
    if (!address) throw new Error('Wallet not connected via Reown');
    const whitelist = whitelists.find((w) => w.id === whitelistId);
    if (!whitelist) throw new Error('Whitelist not found');
    const updated = addToWhitelist(whitelist, addressToAdd);
    setWhitelists((prev) =>
      prev.map((w) => (w.id === whitelistId ? updated : w))
    );
    console.log('Adding to whitelist:', { whitelistId, addressToAdd });
  };

  return {
    whitelists,
    add,
    removeFromWhitelist,
    isWhitelisted,
    address,
  };
}


