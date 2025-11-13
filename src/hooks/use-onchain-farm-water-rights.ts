import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';

/**
 * Hook for onchain farm water rights management
 * Uses Reown wallet for all transactions
 */
export function useOnchainFarmWaterRights() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [waterRights, setWaterRights] = useState<any[]>([]);

  const recordWaterUsage = async (
    contractAddress: Address,
    rightId: bigint,
    amount: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    
    await writeContract({
      address: contractAddress,
      abi: [
        {
          inputs: [
            { name: 'rightId', type: 'uint256' },
            { name: 'amount', type: 'uint256' }
          ],
          name: 'recordWaterUsage',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function'
        }
      ],
      functionName: 'recordWaterUsage',
      args: [rightId, amount],
    });
  };

  return { 
    waterRights, 
    recordWaterUsage, 
    address 
  };
}

