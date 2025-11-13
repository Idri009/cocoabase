import { useState } from 'react';
import { useAccount } from 'wagmi';
import type { Address } from 'viem';
import {
  createLoan,
  type Loan,
} from '@/lib/onchain-agricultural-loan-management-utils';

export function useOnchainAgriculturalLoanManagement() {
  const { address } = useAccount();
  const [loans, setLoans] = useState<Loan[]>([]);

  const create = async (
    lender: Address,
    amount: bigint,
    interestRate: number
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    const loan = createLoan(address, lender, amount, interestRate);
    setLoans([...loans, loan]);
  };

  return { loans, create, address };
}
