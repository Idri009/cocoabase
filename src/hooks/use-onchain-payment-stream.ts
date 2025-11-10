import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  type PaymentStream,
} from '@/lib/onchain-payment-stream-utils';

export function useOnchainPaymentStream() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [streams, setStreams] = useState<PaymentStream[]>([]);

  const createStream = async (
    payee: Address,
    amountPerSecond: bigint,
    duration: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    await writeContract({
      address: '0x0000000000000000000000000000000000000000' as Address,
      abi: [],
      functionName: 'createStream',
      args: [payee, amountPerSecond, duration],
    });
  };

  return { streams, createStream, address };
}
