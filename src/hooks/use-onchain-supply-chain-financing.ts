import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createSupplyChainFinance,
  approveSupplyChainFinance,
  activateFinance,
  repayFinance,
  calculateInterest,
  isFinanceOverdue,
  type SupplyChainFinance,
} from '@/lib/onchain-supply-chain-financing-utils';

/**
 * Hook for onchain supply chain financing operations
 * Requires Reown wallet connection via useAccount
 */
export function useOnchainSupplyChainFinancing() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [finances, setFinances] = useState<SupplyChainFinance[]>([]);
  const [isRequesting, setIsRequesting] = useState(false);
  const [isApproving, setIsApproving] = useState(false);

  const requestFinance = async (
    lender: Address,
    amount: bigint,
    interestRate: number,
    duration: bigint,
    purpose: string
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    setIsRequesting(true);
    try {
      const finance = createSupplyChainFinance(
        address,
        lender,
        amount,
        interestRate,
        duration,
        purpose
      );
      setFinances((prev) => [...prev, finance]);
      console.log('Requesting supply chain finance:', finance);
      // Onchain finance request via smart contract
      await writeContract({
        address: '0x0000000000000000000000000000000000000000' as Address,
        abi: [],
        functionName: 'requestSupplyChainFinance',
        args: [lender, amount, interestRate, duration, purpose],
      });
    } finally {
      setIsRequesting(false);
    }
  };

  const approveFinanceRequest = async (financeId: bigint): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    setIsApproving(true);
    try {
      const finance = finances.find((f) => f.id === financeId);
      if (!finance) throw new Error('Finance not found');
      const approved = approveSupplyChainFinance(finance);
      setFinances((prev) =>
        prev.map((f) => (f.id === financeId ? approved : f))
      );
      console.log('Approving supply chain finance:', { financeId });
      // Onchain finance approval via smart contract
      await writeContract({
        address: '0x0000000000000000000000000000000000000000' as Address,
        abi: [],
        functionName: 'approveSupplyChainFinance',
        args: [financeId],
      });
    } finally {
      setIsApproving(false);
    }
  };

  const repayFinancePayment = async (
    financeId: bigint,
    repaymentAmount: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    try {
      const finance = finances.find((f) => f.id === financeId);
      if (!finance) throw new Error('Finance not found');
      const updated = repayFinance(finance, repaymentAmount);
      setFinances((prev) =>
        prev.map((f) => (f.id === financeId ? updated : f))
      );
      console.log('Repaying supply chain finance:', { financeId, repaymentAmount });
      // Onchain repayment via smart contract
      await writeContract({
        address: '0x0000000000000000000000000000000000000000' as Address,
        abi: [],
        functionName: 'repaySupplyChainFinance',
        args: [financeId, repaymentAmount],
      });
    } finally {
      // Repayment complete
    }
  };

  return {
    finances,
    requestFinance,
    approveFinanceRequest,
    repayFinancePayment,
    activateFinance,
    calculateInterest,
    isFinanceOverdue,
    isRequesting,
    isApproving,
    address,
  };
}

