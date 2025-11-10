import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createEscrow,
  type Escrow,
} from '@/lib/onchain-escrow-utils';

export function useOnchainEscrow() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [escrows, setEscrows] = useState<Escrow[]>([]);

  const createNewEscrow = async (
    seller: Address,
    amount: bigint,
    token: Address
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    await writeContract({
      address: '0x0000000000000000000000000000000000000000' as Address,
      abi: [],
      functionName: 'createEscrow',
      args: [seller, amount, token],
    });
  };

  return { escrows, createNewEscrow, address };
}
