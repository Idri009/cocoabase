import { useState } from 'react';
import { useAccount } from 'wagmi';
import {
  recordSoilMoisture,
  type SoilMoistureReading,
} from '@/lib/onchain-soil-moisture-monitoring-utils';

export function useOnchainSoilMoistureMonitoring() {
  const { address } = useAccount();
  const [readings, setReadings] = useState<SoilMoistureReading[]>([]);

  const record = async (
    plantationId: bigint,
    moistureLevel: number,
    sensorId: string
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected');
    const reading = recordSoilMoisture(address, plantationId, moistureLevel, sensorId);
    setReadings([...readings, reading]);
  };

  return { readings, record, address };
}
