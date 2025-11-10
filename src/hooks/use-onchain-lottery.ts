import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createLottery,
  type Lottery,
} from '@/lib/onchain-lottery-utils';

export function useOnchainLottery() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [lotteries, setLotteries] = useState<Lottery[]>([]);

  const purchaseTicket = async (
    lotteryId: bigint,
    ticketNumber: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    await writeContract({
      address: '0x0000000000000000000000000000000000000000' as Address,
      abi: [],
      functionName: 'purchaseTicket',
      args: [lotteryId, ticketNumber],
    });
  };

  return { lotteries, purchaseTicket, address };
}
