import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createWaterQualityTest,
  type WaterQualityTest,
} from '@/lib/onchain-farm-water-quality-monitoring-utils';

/**
 * Hook for onchain farm water quality monitoring
 * Uses Reown wallet for all transactions
 */
export function useOnchainFarmWaterQualityMonitoring() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [tests, setTests] = useState<WaterQualityTest[]>([]);

  const testWaterQuality = async (
    plantationId: string,
    phLevel: number,
    dissolvedOxygen: bigint,
    turbidity: number,
    contaminants: string[]
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    const test = createWaterQualityTest(address, plantationId, phLevel, dissolvedOxygen, turbidity, contaminants);
    setTests([...tests, test]);
  };

  const verifyTest = async (
    contractAddress: Address,
    testId: string
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    await writeContract({
      address: contractAddress,
      abi: [],
      functionName: 'verifyTest',
      args: [testId],
    });
  };

  return { tests, testWaterQuality, verifyTest, address };
}

