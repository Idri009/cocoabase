import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createQualityCheck,
  type QualityCheck,
} from '@/lib/onchain-farm-quality-assurance-utils';

/**
 * Hook for onchain farm quality assurance
 * Uses Reown wallet for all transactions
 */
export function useOnchainFarmQualityAssurance() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [checks, setChecks] = useState<QualityCheck[]>([]);

  const performQualityCheck = async (
    productId: string,
    qualityScore: number,
    inspectorNotes: string
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    const check = createQualityCheck(address, productId, qualityScore, inspectorNotes);
    setChecks([...checks, check]);
  };

  const certifyQuality = async (
    contractAddress: Address,
    checkId: string
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    await writeContract({
      address: contractAddress,
      abi: [],
      functionName: 'certifyQuality',
      args: [checkId],
    });
  };

  return { checks, performQualityCheck, certifyQuality, address };
}

