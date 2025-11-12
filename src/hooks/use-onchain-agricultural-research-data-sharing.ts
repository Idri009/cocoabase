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
  const [isSharing, setIsSharing] = useState(false);

  const share = async (
    dataType: string,
    accessLevel: 'public' | 'private' | 'restricted',
    hash: string
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    setIsSharing(true);
    try {
      const researchData = createResearchData(address, dataType, accessLevel, hash);
      setData((prev) => [...prev, researchData]);
      console.log('Sharing research data:', researchData);
    } finally {
      setIsSharing(false);
    }
  };

  return {
    data,
    share,
    getPublicData,
    getDataByType,
    verifyDataIntegrity,
    isSharing,
    address,
  };
}
