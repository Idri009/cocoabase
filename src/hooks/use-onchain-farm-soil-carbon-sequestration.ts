import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createCarbonSequestration,
  type CarbonSequestration,
} from '@/lib/onchain-farm-soil-carbon-sequestration-utils';

/**
 * Hook for onchain soil carbon sequestration
 * Uses Reown wallet for all transactions
 */
export function useOnchainFarmSoilCarbonSequestration() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [sequestrations, setSequestrations] = useState<CarbonSequestration[]>([]);

  const recordSequestration = async (
    contractAddress: Address,
    plantationId: bigint,
    carbonAmount: bigint,
    soilType: string
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    
    const sequestration = createCarbonSequestration(
      address,
      plantationId,
      carbonAmount,
      soilType
    );
    
    await writeContract({
      address: contractAddress,
      abi: [
        {
          inputs: [
            { name: 'plantationId', type: 'uint256' },
            { name: 'carbonAmount', type: 'uint256' },
            { name: 'soilType', type: 'string' }
          ],
          name: 'recordSequestration',
          outputs: [{ name: '', type: 'uint256' }],
          stateMutability: 'nonpayable',
          type: 'function'
        }
      ],
      functionName: 'recordSequestration',
      args: [plantationId, carbonAmount, soilType],
    });
    
    setSequestrations([...sequestrations, sequestration]);
  };

  return { 
    sequestrations, 
    recordSequestration, 
    address 
  };
}
