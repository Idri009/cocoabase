import { useState } from 'react';
import { useAccount } from 'wagmi';
import {
  createOptimizationPlan,
  type OptimizationPlan,
} from '@/lib/onchain-farm-resource-optimization-utils';

export function useOnchainFarmResourceOptimization() {
  const { address } = useAccount();
  const [plans, setPlans] = useState<OptimizationPlan[]>([]);

  const create = async (
    resourceType: string,
    currentUsage: bigint,
    optimizedUsage: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    const plan = createOptimizationPlan(address, resourceType, currentUsage, optimizedUsage);
    setPlans([...plans, plan]);
  };

  return { plans, create, address };
}
