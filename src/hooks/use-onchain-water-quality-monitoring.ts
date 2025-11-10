import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createWaterQualityRecord,
  determineWaterStatus,
  calculateWaterQualityScore,
  getWaterQualityTrend,
  type WaterQualityRecord,
} from '@/lib/onchain-water-quality-monitoring-utils';

/**
 * Hook for onchain water quality monitoring operations
 * Requires Reown wallet connection via useAccount
 */
export function useOnchainWaterQualityMonitoring() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [records, setRecords] = useState<WaterQualityRecord[]>([]);
  const [isRecording, setIsRecording] = useState(false);

  const recordWaterQuality = async (
    location: string,
    pH: number,
    turbidity: number,
    dissolvedOxygen: number,
    temperature: number,
    contaminationLevel: number
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    setIsRecording(true);
    try {
      const record = createWaterQualityRecord(
        address,
        location,
        pH,
        turbidity,
        dissolvedOxygen,
        temperature,
        contaminationLevel
      );
      setRecords((prev) => [...prev, record]);
      console.log('Recording water quality:', record);
      // Onchain recording via smart contract
      await writeContract({
        address: '0x0000000000000000000000000000000000000000' as Address,
        abi: [],
        functionName: 'recordWaterQuality',
        args: [location, pH, turbidity, dissolvedOxygen, temperature, contaminationLevel],
      });
    } finally {
      setIsRecording(false);
    }
  };

  return {
    records,
    recordWaterQuality,
    determineWaterStatus,
    calculateWaterQualityScore,
    getWaterQualityTrend,
    isRecording,
    address,
  };
}

