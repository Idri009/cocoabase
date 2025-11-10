import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createTimelock,
  type Timelock,
} from '@/lib/onchain-timelock-utils';

export function useOnchainTimelock() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [timelocks, setTimelocks] = useState<Timelock[]>([]);

  const createLock = async (
    to: Address,
    amount: bigint,
    unlockTime: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    await writeContract({
      address: '0x0000000000000000000000000000000000000000' as Address,
      abi: [],
      functionName: 'createTimelock',
      args: [to, amount, unlockTime],
    });
  };

  return { timelocks, createLock, address };
}
