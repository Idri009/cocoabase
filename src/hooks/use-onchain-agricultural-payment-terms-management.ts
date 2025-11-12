import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createPaymentTerm,
  markAsPaid,
  getOverdueTerms,
  calculateTotalAmount,
  type PaymentTerm,
} from '@/lib/onchain-agricultural-payment-terms-management-utils';

export function useOnchainAgriculturalPaymentTermsManagement() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [terms, setTerms] = useState<PaymentTerm[]>([]);
  const [isPaying, setIsPaying] = useState(false);

  const create = (
    buyer: Address,
    seller: Address,
    amount: bigint,
    dueDate: bigint
  ) => {
    if (!address) throw new Error('Wallet not connected via Reown');
    const term = createPaymentTerm(address, buyer, seller, amount, dueDate);
    setTerms((prev) => [...prev, term]);
    console.log('Creating payment term:', { buyer, seller, amount });
  };

  const pay = async (termId: bigint): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    setIsPaying(true);
    try {
      const term = terms.find((t) => t.id === termId);
      if (!term) throw new Error('Payment term not found');
      const updated = markAsPaid(term);
      console.log('Paying term:', { termId });
    } finally {
      setIsPaying(false);
    }
  };

  return {
    terms,
    create,
    pay,
    getOverdueTerms,
    calculateTotalAmount,
    isPaying,
    address,
  };
}
