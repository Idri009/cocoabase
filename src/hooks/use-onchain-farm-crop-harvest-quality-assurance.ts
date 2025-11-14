import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createQualityAssurance,
  type QualityAssurance,
} from '@/lib/onchain-farm-crop-harvest-quality-assurance-utils';

/**
 * Hook for onchain farm crop harvest quality assurance
 * Uses blockchain wallet for all web3 transactions
 */
export function useOnchainFarmCropHarvestQualityAssurance() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [assurances, setAssurances] = useState<QualityAssurance[]>([]);

  const createAssurance = async (
    harvestId: string,
    qualityStandard: string,
    testResults: string[],
    inspector: string,
    inspectionDate: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Web3 wallet not connected');
    const assurance = createQualityAssurance(address, harvestId, qualityStandard, testResults, inspector, inspectionDate);
    setAssurances([...assurances, assurance]);
  };

  const approveQuality = async (
    contractAddress: Address,
    assuranceId: string
  ): Promise<void> => {
    if (!address) throw new Error('Web3 wallet not connected');
    await writeContract({
      address: contractAddress,
      abi: [],
      functionName: 'approveQuality',
      args: [assuranceId],
    });
  };

  return { assurances, createAssurance, approveQuality, address };
}

