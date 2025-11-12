import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createFinanceRequest,
  approveRequest,
  calculateRepayment,
  getPendingRequests,
  type FinanceRequest,
} from '@/lib/onchain-agricultural-supply-chain-finance-utils';

export function useOnchainAgriculturalSupplyChainFinance() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [requests, setRequests] = useState<FinanceRequest[]>([]);
  const [isRequesting, setIsRequesting] = useState(false);

  const request = async (
    amount: bigint,
    collateral: bigint,
    interestRate: number
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    setIsRequesting(true);
    try {
      const financeRequest = createFinanceRequest(address, amount, collateral, interestRate);
      console.log('Creating finance request:', financeRequest);
    } finally {
      setIsRequesting(false);
    }
  };

  return {
    requests,
    request,
    approveRequest,
    calculateRepayment,
    getPendingRequests,
    isRequesting,
    address,
  };
}
