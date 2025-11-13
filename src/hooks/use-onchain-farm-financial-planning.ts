import { useState } from 'react';
import { useAccount } from 'wagmi';
import {
  createFinancialPlan,
  type FinancialPlan,
} from '@/lib/onchain-farm-financial-planning-utils';

export function useOnchainFarmFinancialPlanning() {
  const { address } = useAccount();
  const [plans, setPlans] = useState<FinancialPlan[]>([]);

  const create = async (
    planType: string,
    budget: bigint,
    period: string
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    const plan = createFinancialPlan(address, planType, budget, period);
    setPlans([...plans, plan]);
  };

  return { plans, create, address };
}
