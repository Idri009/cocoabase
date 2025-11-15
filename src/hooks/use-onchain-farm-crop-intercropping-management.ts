import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createIntercroppingSystem,
  type IntercroppingSystem,
} from '@/lib/onchain-farm-crop-intercropping-management-utils';

export function useOnchainFarmCropIntercroppingManagement() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [systems, setSystems] = useState<IntercroppingSystem[]>([]);

  const createSystem = async (
    contractAddress: Address,
    fieldId: bigint,
    cropTypes: string[],
    spacing: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    
    const system = createIntercroppingSystem(
      address,
      fieldId,
      cropTypes,
      spacing
    );
    
    await writeContract({
      address: contractAddress,
      abi: [
        {
          inputs: [
            { name: 'fieldId', type: 'uint256' },
            { name: 'cropTypes', type: 'string[]' },
            { name: 'spacing', type: 'uint256' }
          ],
          name: 'createSystem',
          outputs: [{ name: '', type: 'uint256' }],
          stateMutability: 'nonpayable',
          type: 'function'
        }
      ],
      functionName: 'createSystem',
      args: [fieldId, cropTypes, spacing],
    });
    
    setSystems([...systems, system]);
  };

  return { 
    systems, 
    createSystem, 
    address 
  };
}


