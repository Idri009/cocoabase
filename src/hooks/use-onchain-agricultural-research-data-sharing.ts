import { useState } from 'react';
import { useAccount } from 'wagmi';
import type { Address } from 'viem';
import {
  createResearchData,
  getPublicData,
  getDataByType,
  verifyDataIntegrity,
  type ResearchData,
} from '@/lib/onchain-agricultural-research-data-sharing-utils';

export function useOnchainAgriculturalResearchDataSharing() {
  const { address } = useAccount();
  const [data, setData] = useState<ResearchData[]>([]);

  const share = (
    dataType: string,
    accessLevel: 'public' | 'private' | 'restricted',
    dataHash: string
  ) => {
    if (!address) throw new Error('Wallet not connected via Reown');
    const researchData = createResearchData(address, dataType, accessLevel, dataHash);
    setData((prev) => [...prev, researchData]);
    console.log('Sharing research data:', { dataType, accessLevel });
  };

  return {
    data,
    share,
    getPublicData,
    getDataByType,
    verifyDataIntegrity,
    address,
  };
}
