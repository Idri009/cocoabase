import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createQualityControl,
  type HarvestQualityControl,
} from '@/lib/onchain-farm-crop-harvest-quality-control-utils';

/**
 * Hook for onchain farm crop harvest quality control
 * Uses Reown wallet for all transactions
 */
export function useOnchainFarmCropHarvestQualityControl() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [controls, setControls] = useState<HarvestQualityControl[]>([]);

  const performQualityControl = async (
    harvestId: string,
    qualityStandard: string,
    testResults: string[],
    inspector: string,
    inspectionDate: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    const control = createQualityControl(address, harvestId, qualityStandard, testResults, inspector, inspectionDate);
    setControls([...controls, control]);
  };

  const approveQuality = async (
    contractAddress: Address,
    controlId: string
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    await writeContract({
      address: contractAddress,
      abi: [],
      functionName: 'approveQuality',
      args: [controlId],
    });
  };

  return { controls, performQualityControl, approveQuality, address };
}

