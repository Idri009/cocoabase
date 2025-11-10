import { useState } from 'react';
import { useAccount } from 'wagmi';
import type { Address } from 'viem';
import {
  createLottery,
  type Lottery,
} from '@/lib/onchain-lottery-utils';

export function useOnchainLottery() {
  const { address } = useAccount();
  const [lotteries, setLotteries] = useState<Lottery[]>([]);

  const purchaseTicket = async (
    lotteryId: bigint,
    ticketNumber: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected');
    console.log('Purchasing ticket:', { lotteryId, ticketNumber });
  };

  return { lotteries, purchaseTicket, address };
}

