import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  type Rental,
} from '@/lib/onchain-rental-utils';

export function useOnchainRental() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [rentals, setRentals] = useState<Rental[]>([]);

  const rentAsset = async (
    asset: Address,
    tokenId: bigint,
    pricePerDay: bigint,
    duration: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    await writeContract({
      address: '0x0000000000000000000000000000000000000000' as Address,
      abi: [],
      functionName: 'rentAsset',
      args: [asset, tokenId, pricePerDay, duration],
    });
  };

  return { rentals, rentAsset, address };
}
