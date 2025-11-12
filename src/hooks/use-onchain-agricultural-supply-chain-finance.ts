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
  const [isApproving, setIsApproving] = useState(false);

  const approve = async (requestId: bigint): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    setIsApproving(true);
    try {
      const request = requests.find((r) => r.id === requestId);
      if (!request) throw new Error('Request not found');
      const updated = approveRequest(request, address);
      console.log('Approving finance request:', { requestId });
    } finally {
      setIsApproving(false);
    }
  };

  return {
    requests,
    approve,
    calculateRepayment,
    getPendingRequests,
    isApproving,
    address,
  };
}
