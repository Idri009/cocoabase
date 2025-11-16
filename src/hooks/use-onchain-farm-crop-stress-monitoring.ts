import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createStressReading,
  type StressReading,
} from '@/lib/onchain-farm-crop-stress-monitoring-utils';

export function useOnchainFarmCropStressMonitoring() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [readings, setReadings] = useState<StressReading[]>([]);

  const recordStress = async (
    contractAddress: Address,
    plantationId: bigint,
    stressType: string,
    stressLevel: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    
    const reading = createStressReading(
      address,
      plantationId,
      stressType,
      stressLevel
    );
    
    await writeContract({
      address: contractAddress,
      abi: [
        {
          inputs: [
            { name: 'plantationId', type: 'uint256' },
            { name: 'stressType', type: 'string' },
            { name: 'stressLevel', type: 'uint256' }
          ],
          name: 'recordStress',
          outputs: [{ name: '', type: 'uint256' }],
          stateMutability: 'nonpayable',
          type: 'function'
        }
      ],
      functionName: 'recordStress',
      args: [plantationId, stressType, stressLevel],
    });
    
    setReadings([...readings, reading]);
  };

  return { 
    readings, 
    recordStress, 
    address 
  };
}



