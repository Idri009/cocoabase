import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createPaymentRecord,
  type PaymentRecord,
} from '@/lib/onchain-farm-crop-harvest-payment-processing-utils';

/**
 * Hook for onchain farm crop harvest payment processing
 * Uses blockchain wallet for all web3 transactions
 */
export function useOnchainFarmCropHarvestPaymentProcessing() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [records, setRecords] = useState<PaymentRecord[]>([]);

  const processPayment = async (
    harvestId: string,
    payer: Address,
    payee: Address,
    amount: bigint,
    paymentDate: bigint,
    paymentMethod: string
  ): Promise<void> => {
    if (!address) throw new Error('Web3 wallet not connected');
    const record = createPaymentRecord(address, harvestId, payer, payee, amount, paymentDate, paymentMethod);
    setRecords([...records, record]);
  };

  const confirmPayment = async (
    contractAddress: Address,
    recordId: string
  ): Promise<void> => {
    if (!address) throw new Error('Web3 wallet not connected');
    await writeContract({
      address: contractAddress,
      abi: [],
      functionName: 'confirmPayment',
      args: [recordId],
    });
  };

  return { records, processPayment, confirmPayment, address };
}

