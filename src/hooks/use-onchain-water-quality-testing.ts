import { useState } from 'react';
import { useAccount } from 'wagmi';
import {
  recordWaterQualityTest,
  type WaterQualityTest,
} from '@/lib/onchain-water-quality-testing-utils';

export function useOnchainWaterQualityTesting() {
  const { address } = useAccount();
  const [tests, setTests] = useState<WaterQualityTest[]>([]);

  const recordTest = async (
    plantationId: bigint,
    pH: number,
    turbidity: number,
    dissolvedOxygen: number
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected');
    const test = recordWaterQualityTest(address, plantationId, pH, turbidity, dissolvedOxygen);
    setTests([...tests, test]);
  };

  return { tests, recordTest, address };
}
