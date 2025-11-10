import { useState } from 'react';
import { useAccount } from 'wagmi';
import type { Address } from 'viem';
import {
  mintCarbonCredit,
  tradeCarbonCredit,
  type CarbonCredit,
} from '@/lib/onchain-carbon-credits-trading-utils';

export function useOnchainCarbonCreditsTrading() {
  const { address } = useAccount();
  const [credits, setCredits] = useState<CarbonCredit[]>([]);

  const mintCredit = async (
    amount: bigint,
    plantationId: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected');
    const credit = mintCarbonCredit(address, amount, plantationId);
    setCredits([...credits, credit]);
  };

  return { credits, mintCredit, address };
}
