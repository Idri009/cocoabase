import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createEscrow,
  type PaymentEscrow,
} from '@/lib/onchain-farm-labor-payment-escrow-utils';

/**
 * Hook for onchain farm labor payment escrow
 * Uses Reown wallet for all transactions
 */
export function useOnchainFarmLaborPaymentEscrow() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [escrows, setEscrows] = useState<PaymentEscrow[]>([]);

  const createEscrowPayment = async (
    worker: Address,
    amount: bigint,
    workDescription: string
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    const escrow = createEscrow(address, worker, amount, workDescription);
    setEscrows([...escrows, escrow]);
  };

  const releasePayment = async (
    contractAddress: Address,
    escrowId: string
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    await writeContract({
      address: contractAddress,
      abi: [],
      functionName: 'releasePayment',
      args: [escrowId],
    });
  };

  return { escrows, createEscrowPayment, releasePayment, address };
}

