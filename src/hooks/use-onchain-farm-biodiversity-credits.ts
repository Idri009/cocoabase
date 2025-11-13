import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createBiodiversityCredit,
  type BiodiversityCredit,
} from '@/lib/onchain-farm-biodiversity-credits-utils';

/**
 * Hook for onchain farm biodiversity credits
 * Uses Reown wallet for all transactions
 */
export function useOnchainFarmBiodiversityCredits() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [credits, setCredits] = useState<BiodiversityCredit[]>([]);

  const mintCredit = async (
    plantationId: string,
    speciesCount: number,
    habitatArea: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    const credit = createBiodiversityCredit(address, plantationId, speciesCount, habitatArea);
    setCredits([...credits, credit]);
  };

  const tradeCredit = async (
    contractAddress: Address,
    creditId: string,
    buyer: Address,
    price: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    await writeContract({
      address: contractAddress,
      abi: [],
      functionName: 'tradeCredit',
      args: [creditId, buyer, price],
    });
  };

  return { credits, mintCredit, tradeCredit, address };
}

