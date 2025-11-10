import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  calculateRoyalty,
  type RoyaltyInfo,
} from '@/lib/onchain-royalty-utils';

export function useOnchainRoyalty() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [royalties, setRoyalties] = useState<RoyaltyInfo[]>([]);

  const setRoyalty = async (
    nft: Address,
    tokenId: bigint,
    percentage: number
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    await writeContract({
      address: nft,
      abi: [],
      functionName: 'setRoyalty',
      args: [tokenId, percentage],
    });
  };

  return { royalties, setRoyalty, address };
}
