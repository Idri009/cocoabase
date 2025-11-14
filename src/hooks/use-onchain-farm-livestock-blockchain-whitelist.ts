import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createWhitelistEntry,
  type WhitelistEntry,
} from '@/lib/onchain-farm-livestock-blockchain-whitelist-utils';

/**
 * Hook for onchain farm livestock blockchain whitelist
 * Uses blockchain wallet for all web3 transactions
 */
export function useOnchainFarmLivestockBlockchainWhitelist() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [entries, setEntries] = useState<WhitelistEntry[]>([]);

  const addToWhitelist = async (
    animalId: string,
    whitelistedAddress: Address,
    whitelistDate: bigint,
    reason: string
  ): Promise<void> => {
    if (!address) throw new Error('Web3 wallet not connected');
    const entry = createWhitelistEntry(address, animalId, whitelistedAddress, whitelistDate, reason);
    setEntries([...entries, entry]);
  };

  const removeFromWhitelist = async (
    contractAddress: Address,
    entryId: string
  ): Promise<void> => {
    if (!address) throw new Error('Web3 wallet not connected');
    await writeContract({
      address: contractAddress,
      abi: [],
      functionName: 'removeFromWhitelist',
      args: [entryId],
    });
  };

  return { entries, addToWhitelist, removeFromWhitelist, address };
}

