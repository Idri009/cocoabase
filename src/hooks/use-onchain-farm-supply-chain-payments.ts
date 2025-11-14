import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createPayment,
  type Payment,
} from '@/lib/onchain-farm-supply-chain-payments-utils';

export function useOnchainFarmSupplyChainPayments() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [payments, setPayments] = useState<Payment[]>([]);

  const createPaymentAction = async (
    contractAddress: Address,
    payee: Address,
    amount: bigint,
    invoiceId: string,
    dueDate: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    
    const payment = createPayment(address, payee, amount, invoiceId, dueDate);
    
    await writeContract({
      address: contractAddress,
      abi: [
        {
          inputs: [
            { name: 'payee', type: 'address' },
            { name: 'amount', type: 'uint256' },
            { name: 'invoiceId', type: 'string' },
            { name: 'dueDate', type: 'uint256' }
          ],
          name: 'createPayment',
          outputs: [{ name: '', type: 'uint256' }],
          stateMutability: 'nonpayable',
          type: 'function'
        }
      ],
      functionName: 'createPayment',
      args: [payee, amount, invoiceId, dueDate],
    });
    
    setPayments([...payments, payment]);
  };

  const processPayment = async (
    contractAddress: Address,
    paymentId: bigint,
    value: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    
    await writeContract({
      address: contractAddress,
      abi: [
        {
          inputs: [{ name: 'paymentId', type: 'uint256' }],
          name: 'processPayment',
          outputs: [],
          stateMutability: 'payable',
          type: 'function'
        }
      ],
      functionName: 'processPayment',
      args: [paymentId],
      value,
    });
  };

  return { payments, createPaymentAction, processPayment, address };
}
