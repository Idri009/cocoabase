import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createFlashLoan,
  executeFlashLoan,
  repayFlashLoan,
  calculateFlashLoanFee,
  type FlashLoan,
} from '@/lib/onchain-flash-loan-utils';

export function useOnchainFlashLoan() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [loans, setLoans] = useState<FlashLoan[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);

  const executeLoan = async (
    token: Address,
    amount: bigint,
    callback: Address
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    setIsExecuting(true);
    try {
      const fee = calculateFlashLoanFee(amount);
      const loan = createFlashLoan(address, token, amount, fee, callback);
      console.log('Executing flash loan:', loan);
    } finally {
      setIsExecuting(false);
    }
  };

  return {
    loans,
    executeLoan,
    repayFlashLoan,
    calculateFlashLoanFee,
    isExecuting,
    address,
  };
}

