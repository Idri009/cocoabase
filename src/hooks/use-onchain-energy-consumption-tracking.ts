import { useState } from 'react';
import { useAccount } from 'wagmi';
import {
  recordEnergyConsumption,
  type EnergyConsumption,
} from '@/lib/onchain-energy-consumption-tracking-utils';

export function useOnchainEnergyConsumptionTracking() {
  const { address } = useAccount();
  const [records, setRecords] = useState<EnergyConsumption[]>([]);

  const record = async (
    plantationId: bigint,
    energyType: EnergyConsumption['energyType'],
    consumption: bigint,
    unit: string
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected');
    const record = recordEnergyConsumption(address, plantationId, energyType, consumption, unit);
    setRecords([...records, record]);
  };

  return { records, record, address };
}
