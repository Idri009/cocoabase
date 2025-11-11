import { useState } from 'react';
import { useAccount } from 'wagmi';
import type { Address } from 'viem';
import {
  createFinanceRequest,
  type SupplyChainFinance,
} from '@/lib/onchain-agricultural-supply-chain-finance-utils';

export function useOnchainAgriculturalSupplyChainFinance() {
  const { address } = useAccount();
  const [finances, setFinances] = useState<SupplyChainFinance[]>([]);

  const create = async (
    lender: Address,
    amount: bigint,
    interestRate: bigint,
    collateral: string
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected');
    const finance = createFinanceRequest(address, lender, amount, interestRate, collateral);
    setFinances([...finances, finance]);
  };

  return { finances, create, address };
}
