import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createSeedTrade,
  type SeedTrade,
} from '@/lib/onchain-farm-seed-exchange-utils';

/**
 * Hook for onchain farm seed exchange
 * Uses Reown wallet for all transactions
 */
export function useOnchainFarmSeedExchange() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [trades, setTrades] = useState<SeedTrade[]>([]);

  const listSeeds = async (
    seedType: string,
    quantity: bigint,
    price: bigint,
    certification: string
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    const trade = createSeedTrade(address, seedType, quantity, price, certification);
    setTrades([...trades, trade]);
  };

  const purchaseSeeds = async (
    contractAddress: Address,
    tradeId: string
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    await writeContract({
      address: contractAddress,
      abi: [],
      functionName: 'purchaseSeeds',
      args: [tradeId],
    });
  };

  return { trades, listSeeds, purchaseSeeds, address };
}

