import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createYieldAnalysis,
  type YieldAnalysis,
} from '@/lib/onchain-farm-crop-yield-analysis-utils';

/**
 * Hook for onchain farm crop yield analysis
 * Uses Reown wallet for all transactions
 */
export function useOnchainFarmCropYieldAnalysis() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [analyses, setAnalyses] = useState<YieldAnalysis[]>([]);

  const analyzeYield = async (
    plantationId: string,
    actualYield: bigint,
    expectedYield: bigint,
    factors: string[]
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    const analysis = createYieldAnalysis(address, plantationId, actualYield, expectedYield, factors);
    setAnalyses([...analyses, analysis]);
  };

  const generateReport = async (
    contractAddress: Address,
    analysisId: string
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    await writeContract({
      address: contractAddress,
      abi: [],
      functionName: 'generateReport',
      args: [analysisId],
    });
  };

  return { analyses, analyzeYield, generateReport, address };
}

