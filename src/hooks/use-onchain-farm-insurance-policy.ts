import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createInsurancePolicy,
  type InsurancePolicy,
} from '@/lib/onchain-farm-insurance-policy-utils';

/**
 * Hook for onchain farm insurance policy management
 * Uses Reown wallet for all transactions
 */
export function useOnchainFarmInsurancePolicy() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [policies, setPolicies] = useState<InsurancePolicy[]>([]);

  const fileClaim = async (
    contractAddress: Address,
    policyId: bigint,
    claimAmount: bigint,
    reason: string
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    
    await writeContract({
      address: contractAddress,
      abi: [
        {
          inputs: [
            { name: 'policyId', type: 'uint256' },
            { name: 'claimAmount', type: 'uint256' },
            { name: 'reason', type: 'string' }
          ],
          name: 'fileClaim',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function'
        }
      ],
      functionName: 'fileClaim',
      args: [policyId, claimAmount, reason],
    });
  };

  return { 
    policies, 
    fileClaim, 
    address 
  };
}

