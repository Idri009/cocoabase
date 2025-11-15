import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createPreventionMeasure,
  type PreventionMeasure,
} from '@/lib/onchain-farm-livestock-disease-prevention-utils';

export function useOnchainFarmLivestockDiseasePrevention() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [measures, setMeasures] = useState<PreventionMeasure[]>([]);

  const applyPrevention = async (
    contractAddress: Address,
    livestockId: bigint,
    diseaseType: string,
    preventionMethod: string,
    nextDueDate: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    
    const measure = createPreventionMeasure(
      address,
      livestockId,
      diseaseType,
      preventionMethod,
      nextDueDate
    );
    
    await writeContract({
      address: contractAddress,
      abi: [
        {
          inputs: [
            { name: 'livestockId', type: 'uint256' },
            { name: 'diseaseType', type: 'string' },
            { name: 'preventionMethod', type: 'string' },
            { name: 'nextDueDate', type: 'uint256' }
          ],
          name: 'applyPrevention',
          outputs: [{ name: '', type: 'uint256' }],
          stateMutability: 'nonpayable',
          type: 'function'
        }
      ],
      functionName: 'applyPrevention',
      args: [livestockId, diseaseType, preventionMethod, nextDueDate],
    });
    
    setMeasures([...measures, measure]);
  };

  return { 
    measures, 
    applyPrevention, 
    address 
  };
}


