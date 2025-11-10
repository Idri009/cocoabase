import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createFractionalNFT,
  type FractionalNFT,
} from '@/lib/onchain-fractional-utils';

export function useOnchainFractional() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [fractionals, setFractionals] = useState<FractionalNFT[]>([]);

  const createFractional = async (
    nft: Address,
    tokenId: bigint,
    shares: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    await writeContract({
      address: '0x0000000000000000000000000000000000000000' as Address,
      abi: [],
      functionName: 'createFractional',
      args: [nft, tokenId, shares],
    });
  };

  return { fractionals, createFractional, address };
}
