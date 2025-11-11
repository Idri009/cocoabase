import { useState } from 'react';
import { useAccount } from 'wagmi';
import {
  shareResearchData,
  type ResearchData,
} from '@/lib/onchain-agricultural-research-data-sharing-utils';

export function useOnchainAgriculturalResearchDataSharing() {
  const { address } = useAccount();
  const [data, setData] = useState<ResearchData[]>([]);

  const share = async (
    researchType: string,
    dataHash: string,
    accessLevel: ResearchData['accessLevel']
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected');
    const research = shareResearchData(address, researchType, dataHash, accessLevel);
    setData([...data, research]);
  };

  return { data, share, address };
}
