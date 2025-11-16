import { useState } from 'react';
import { useAccount } from 'wagmi';
import {
  createCarbonFootprint,
  type CarbonFootprint,
} from '@/lib/onchain-farm-carbon-footprint-tracking-utils';

export function useOnchainFarmCarbonFootprintTracking() {
  const { address } = useAccount();
  const [footprints, setFootprints] = useState<CarbonFootprint[]>([]);

  const create = async (
    activity: string,
    emissions: bigint,
    offset: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    const footprint = createCarbonFootprint(address, activity, emissions, offset);
    setFootprints([...footprints, footprint]);
  };

  return { footprints, create, address };
}



