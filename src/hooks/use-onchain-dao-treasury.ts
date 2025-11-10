import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createDAOTreasury,
  depositToTreasury,
  withdrawFromTreasury,
  getTreasuryBalance,
  type DAOTreasury,
} from '@/lib/onchain-dao-treasury-utils';

export function useOnchainDAOTreasury() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [treasuries, setTreasuries] = useState<DAOTreasury[]>([]);
  const [isDepositing, setIsDepositing] = useState(false);

  const deposit = async (
    treasuryId: bigint,
    token: Address,
    amount: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    setIsDepositing(true);
    try {
      const treasury = treasuries.find((t) => t.id === treasuryId);
      if (!treasury) throw new Error('Treasury not found');
      const updated = depositToTreasury(treasury, token, amount);
      console.log('Depositing to treasury:', { treasuryId, token, amount });
    } finally {
      setIsDepositing(false);
    }
  };

  return {
    treasuries,
    deposit,
    withdrawFromTreasury,
    getTreasuryBalance,
    isDepositing,
    address,
  };
}

