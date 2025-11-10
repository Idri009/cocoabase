import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createLoan,
  repayLoan,
  liquidateLoan,
  calculateTotalOwed,
  calculateRemainingBalance,
  type Loan,
} from '@/lib/onchain-lending-utils';

export function useOnchainLending() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [loans, setLoans] = useState<Loan[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [isRepaying, setIsRepaying] = useState(false);

  const createNewLoan = async (
    lender: Address,
    principal: bigint,
    interestRate: number,
    duration: bigint,
    collateral: bigint,
    collateralToken: Address
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected');
    setIsCreating(true);
    try {
      const loan = createLoan(
        address,
        lender,
        principal,
        interestRate,
        duration,
        collateral,
        collateralToken
      );
      console.log('Creating loan:', loan);
    } finally {
      setIsCreating(false);
    }
  };

  const repayLoanAmount = async (
    loanId: bigint,
    amount: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected');
    setIsRepaying(true);
    try {
      const currentTime = BigInt(Date.now());
      const loan = loans.find((l) => l.id === loanId);
      if (!loan) throw new Error('Loan not found');
      const updated = repayLoan(loan, amount, currentTime);
      if (updated) {
        console.log('Repaying loan:', { loanId, amount, address });
      }
    } finally {
      setIsRepaying(false);
    }
  };

  return {
    loans,
    createNewLoan,
    repayLoanAmount,
    liquidateLoan,
    calculateTotalOwed,
    calculateRemainingBalance,
    isCreating,
    isRepaying,
    address,
  };
}
