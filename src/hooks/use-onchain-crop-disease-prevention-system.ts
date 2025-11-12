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

  const create = (diseaseType: string, scheduledDate: bigint) => {
    if (!address) throw new Error('Wallet not connected via Reown');
    const plan = createPreventionPlan(address, diseaseType, scheduledDate);
    setPlans((prev) => [...prev, plan]);
    console.log('Creating prevention plan:', { diseaseType, scheduledDate });
  };

  return {
    plans,
    create,
    completePrevention,
    getScheduledPreventions,
    getPreventionsByDisease,
    address,
  };
}
