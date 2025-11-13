import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createPayment,
  type SupplyChainPayment,
} from '@/lib/onchain-farm-supply-chain-payments-utils';

/**
 * Hook for onchain farm supply chain payments
 * Uses Reown wallet for all transactions
 */
export function useOnchainFarmSupplyChainPayments() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [payments, setPayments] = useState<SupplyChainPayment[]>([]);

  const initiatePayment = async (
    supplier: Address,
    amount: bigint,
    orderId: string
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    const payment = createPayment(address, supplier, amount, orderId);
    setPayments([...payments, payment]);
  };

  const confirmPayment = async (
    contractAddress: Address,
    paymentId: string
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    await writeContract({
      address: contractAddress,
      abi: [],
      functionName: 'confirmPayment',
      args: [paymentId],
    });
  };

  return { payments, initiatePayment, confirmPayment, address };
}

