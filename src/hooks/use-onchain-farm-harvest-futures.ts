import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createFuturesContract,
  type HarvestFutures,
} from '@/lib/onchain-farm-harvest-futures-utils';

/**
 * Hook for onchain farm harvest futures
 * Uses Reown wallet for all transactions
 */
export function useOnchainFarmHarvestFutures() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [futures, setFutures] = useState<HarvestFutures[]>([]);

  const createFutures = async (
    plantationId: string,
    expectedYield: bigint,
    price: bigint,
    deliveryDate: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    const contract = createFuturesContract(address, plantationId, expectedYield, price, deliveryDate);
    setFutures([...futures, contract]);
  };

  const settleFutures = async (
    contractAddress: Address,
    futuresId: string,
    actualYield: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    await writeContract({
      address: contractAddress,
      abi: [],
      functionName: 'settleFutures',
      args: [futuresId, actualYield],
    });
  };

  return { futures, createFutures, settleFutures, address };
}

