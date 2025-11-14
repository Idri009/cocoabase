import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createEnhancementActivity,
  type EnhancementActivity,
} from '@/lib/onchain-farm-crop-biodiversity-enhancement-utils';

export function useOnchainFarmCropBiodiversityEnhancement() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [activities, setActivities] = useState<EnhancementActivity[]>([]);

  const createActivity = async (
    contractAddress: Address,
    plantationId: bigint,
    activityType: string,
    speciesAdded: string
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    
    const activity = createEnhancementActivity(
      address,
      plantationId,
      activityType,
      speciesAdded
    );
    
    await writeContract({
      address: contractAddress,
      abi: [
        {
          inputs: [
            { name: 'plantationId', type: 'uint256' },
            { name: 'activityType', type: 'string' },
            { name: 'speciesAdded', type: 'string' }
          ],
          name: 'createActivity',
          outputs: [{ name: '', type: 'uint256' }],
          stateMutability: 'nonpayable',
          type: 'function'
        }
      ],
      functionName: 'createActivity',
      args: [plantationId, activityType, speciesAdded],
    });
    
    setActivities([...activities, activity]);
  };

  return { 
    activities, 
    createActivity, 
    address 
  };
}

