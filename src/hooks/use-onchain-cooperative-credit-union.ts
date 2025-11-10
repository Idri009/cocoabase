import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createCreditUnionMember,
  requestCreditUnionLoan,
  calculateLoanInterest,
  repayLoan,
  calculateShareDividends,
  type CreditUnionMember,
  type CreditUnionLoan,
} from '@/lib/onchain-cooperative-credit-union-utils';

/**
 * Hook for onchain cooperative credit union operations
 * Requires Reown wallet connection via useAccount
 */
export function useOnchainCooperativeCreditUnion() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [members, setMembers] = useState<CreditUnionMember[]>([]);
  const [loans, setLoans] = useState<CreditUnionLoan[]>([]);
  const [isJoining, setIsJoining] = useState(false);
  const [isRequestingLoan, setIsRequestingLoan] = useState(false);

  const joinCreditUnion = async (): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    setIsJoining(true);
    try {
      const member = createCreditUnionMember(address);
      setMembers((prev) => [...prev, member]);
      console.log('Joining credit union:', member);
      // Onchain membership via smart contract
      await writeContract({
        address: '0x0000000000000000000000000000000000000000' as Address,
        abi: [],
        functionName: 'joinCreditUnion',
        args: [],
      });
    } finally {
      setIsJoining(false);
    }
  };

  const requestLoan = async (
    amount: bigint,
    interestRate: number,
    duration: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    setIsRequestingLoan(true);
    try {
      const loan = requestCreditUnionLoan(address, amount, interestRate, duration);
      setLoans((prev) => [...prev, loan]);
      console.log('Requesting credit union loan:', loan);
      // Onchain loan request via smart contract
      await writeContract({
        address: '0x0000000000000000000000000000000000000000' as Address,
        abi: [],
        functionName: 'requestCreditUnionLoan',
        args: [amount, interestRate, duration],
      });
    } finally {
      setIsRequestingLoan(false);
    }
  };

  const repayLoanPayment = async (
    loanId: bigint,
    repaymentAmount: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    try {
      const loan = loans.find((l) => l.id === loanId);
      if (!loan) throw new Error('Loan not found');
      const updated = repayLoan(loan, repaymentAmount);
      setLoans((prev) =>
        prev.map((l) => (l.id === loanId ? updated : l))
      );
      console.log('Repaying loan:', { loanId, repaymentAmount });
      // Onchain repayment via smart contract
      await writeContract({
        address: '0x0000000000000000000000000000000000000000' as Address,
        abi: [],
        functionName: 'repayLoan',
        args: [loanId, repaymentAmount],
      });
    } finally {
      // Repayment complete
    }
  };

  return {
    members,
    loans,
    joinCreditUnion,
    requestLoan,
    repayLoanPayment,
    calculateLoanInterest,
    calculateShareDividends,
    isJoining,
    isRequestingLoan,
    address,
  };
}

