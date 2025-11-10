import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createDispute,
  type Dispute,
} from '@/lib/onchain-dispute-utils';

export function useOnchainDispute() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [disputes, setDisputes] = useState<Dispute[]>([]);

  const fileDispute = async (
    escrowId: bigint,
    respondent: Address,
    reason: string
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    await writeContract({
      address: '0x0000000000000000000000000000000000000000' as Address,
      abi: [],
      functionName: 'fileDispute',
      args: [escrowId, respondent, reason],
    });
  };

  return { disputes, fileDispute, address };
}
