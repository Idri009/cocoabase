import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createDebtRegistry,
  repayDebt,
  calculateTotalOwed,
  isDebtOverdue,
  type DebtRegistry,
} from '@/lib/onchain-debt-registry-utils';

export function useOnchainDebtRegistry() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [debts, setDebts] = useState<DebtRegistry[]>([]);
  const [isRepaying, setIsRepaying] = useState(false);

  const repay = async (debtId: bigint, amount: bigint): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    setIsRepaying(true);
    try {
      const currentTime = BigInt(Date.now());
      const debt = debts.find((d) => d.id === debtId);
      if (!debt) throw new Error('Debt not found');
      const updated = repayDebt(debt, amount, currentTime);
      console.log('Repaying debt:', { debtId, amount });
    } finally {
      setIsRepaying(false);
    }
  };

  return {
    debts,
    repay,
    calculateTotalOwed,
    isDebtOverdue,
    isRepaying,
    address,
  };
}

