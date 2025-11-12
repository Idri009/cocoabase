import { useState } from 'react';
import { useAccount } from 'wagmi';
import type { Address } from 'viem';
import {
  createPreventionPlan,
  completePrevention,
  getScheduledPreventions,
  getPreventionsByDisease,
  type PreventionPlan,
} from '@/lib/onchain-crop-disease-prevention-system-utils';

export function useOnchainCropDiseasePreventionSystem() {
  const { address } = useAccount();
  const [plans, setPlans] = useState<PreventionPlan[]>([]);
  const [isCreating, setIsCreating] = useState(false);

  const create = async (
    diseaseType: string,
    scheduledDate: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    setIsCreating(true);
    try {
      const plan = createPreventionPlan(address, diseaseType, scheduledDate);
      setPlans((prev) => [...prev, plan]);
      console.log('Creating prevention plan:', plan);
    } finally {
      setIsCreating(false);
    }
  };

  return {
    plans,
    create,
    completePrevention,
    getScheduledPreventions,
    getPreventionsByDisease,
    isCreating,
    address,
  };
}
