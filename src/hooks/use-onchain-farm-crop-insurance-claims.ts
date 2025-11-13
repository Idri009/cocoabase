import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createClaim,
  type InsuranceClaim,
} from '@/lib/onchain-farm-crop-insurance-claims-utils';

/**
 * Hook for onchain farm crop insurance claims
 * Uses Reown wallet for all transactions
 */
export function useOnchainFarmCropInsuranceClaims() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [claims, setClaims] = useState<InsuranceClaim[]>([]);

  const fileClaim = async (
    policyId: string,
    damageAmount: bigint,
    damageType: string,
    incidentDate: bigint,
    description: string
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    const claim = createClaim(address, policyId, damageAmount, damageType, incidentDate, description);
    setClaims([...claims, claim]);
  };

  const processClaim = async (
    contractAddress: Address,
    claimId: string
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    await writeContract({
      address: contractAddress,
      abi: [],
      functionName: 'processClaim',
      args: [claimId],
    });
  };

  return { claims, fileClaim, processClaim, address };
}

