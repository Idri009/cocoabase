import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createCropInsurance,
  type CropInsurance,
} from '@/lib/onchain-farm-crop-insurance-utils';

/**
 * Hook for onchain farm crop insurance
 * Uses Reown wallet for all transactions
 */
export function useOnchainFarmCropInsurance() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [policies, setPolicies] = useState<CropInsurance[]>([]);

  const purchaseInsurance = async (
    plantationId: string,
    coverageAmount: bigint,
    premium: bigint,
    cropType: string
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    const policy = createCropInsurance(address, plantationId, coverageAmount, premium, cropType);
    setPolicies([...policies, policy]);
  };

  const fileClaim = async (
    contractAddress: Address,
    policyId: string,
    damageAmount: bigint,
    reason: string
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    await writeContract({
      address: contractAddress,
      abi: [],
      functionName: 'fileClaim',
      args: [policyId, damageAmount, reason],
    });
  };

  return { policies, purchaseInsurance, fileClaim, address };
}

