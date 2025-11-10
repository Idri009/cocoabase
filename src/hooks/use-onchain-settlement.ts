import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createSettlement,
  settle,
  disputeSettlement,
  cancelSettlement,
  calculateNetAmount,
  type Settlement,
} from '@/lib/onchain-settlement-utils';

export function useOnchainSettlement() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [isSettling, setIsSettling] = useState(false);

  const createNewSettlement = async (
    partyB: Address,
    amountA: bigint,
    amountB: bigint,
    tokenA: Address,
    tokenB: Address
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected');
    setIsCreating(true);
    try {
      const settlement = createSettlement(
        address,
        partyB,
        amountA,
        amountB,
        tokenA,
        tokenB
      );
      console.log('Creating settlement:', settlement);
    } finally {
      setIsCreating(false);
    }
  };

  const settleTransaction = async (settlementId: bigint): Promise<void> => {
    if (!address) throw new Error('Wallet not connected');
    setIsSettling(true);
    try {
      const currentTime = BigInt(Date.now());
      const settlement = settlements.find((s) => s.id === settlementId);
      if (!settlement) throw new Error('Settlement not found');
      const updated = settle(settlement, address, currentTime);
      if (updated) {
        console.log('Settling transaction:', { settlementId, address });
      }
    } finally {
      setIsSettling(false);
    }
  };

  return {
    settlements,
    createNewSettlement,
    settleTransaction,
    disputeSettlement,
    cancelSettlement,
    calculateNetAmount,
    isCreating,
    isSettling,
    address,
  };
}

