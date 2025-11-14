import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createSample,
  type HarvestSample,
} from '@/lib/onchain-farm-crop-harvest-sampling-utils';

/**
 * Hook for onchain farm crop harvest sampling
 * Uses Reown wallet for all transactions
 */
export function useOnchainFarmCropHarvestSampling() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [samples, setSamples] = useState<HarvestSample[]>([]);

  const createSample = async (
    harvestId: string,
    sampleType: string,
    sampleSize: bigint,
    samplingDate: bigint,
    location: string
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    const sample = createSample(address, harvestId, sampleType, sampleSize, samplingDate, location);
    setSamples([...samples, sample]);
  };

  const verifySample = async (
    contractAddress: Address,
    sampleId: string
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    await writeContract({
      address: contractAddress,
      abi: [],
      functionName: 'verifySample',
      args: [sampleId],
    });
  };

  return { samples, createSample, verifySample, address };
}

