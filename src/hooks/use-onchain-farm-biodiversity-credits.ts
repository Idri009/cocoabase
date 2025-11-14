import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createBiodiversityCredit,
  type BiodiversityCredit,
} from '@/lib/onchain-farm-biodiversity-credits-utils';

/**
 * Hook for onchain biodiversity credits
 * Uses Reown wallet for all transactions
 */
export function useOnchainFarmBiodiversityCredits() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [credits, setCredits] = useState<BiodiversityCredit[]>([]);

  const issueCredit = async (
    contractAddress: Address,
    plantationId: bigint,
    creditAmount: bigint,
    biodiversityType: string
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    
    const credit = createBiodiversityCredit(
      address,
      plantationId,
      creditAmount,
      biodiversityType
    );
    
    await writeContract({
      address: contractAddress,
      abi: [
        {
          inputs: [
            { name: 'plantationId', type: 'uint256' },
            { name: 'creditAmount', type: 'uint256' },
            { name: 'biodiversityType', type: 'string' }
          ],
          name: 'issueCredit',
          outputs: [{ name: '', type: 'uint256' }],
          stateMutability: 'nonpayable',
          type: 'function'
        }
      ],
      functionName: 'issueCredit',
      args: [plantationId, creditAmount, biodiversityType],
    });
    
    setCredits([...credits, credit]);
  };

  return { 
    credits, 
    issueCredit, 
    address 
  };
}
