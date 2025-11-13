import { useState } from 'react';
import { useAccount } from 'wagmi';
import {
  createEnergyConsumption,
  type EnergyConsumption,
} from '@/lib/onchain-farm-energy-consumption-tracking-utils';

export function useOnchainFarmEnergyConsumptionTracking() {
  const { address } = useAccount();
  const [records, setRecords] = useState<EnergyConsumption[]>([]);

  const create = async (
    source: string,
    amount: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    const record = createEnergyConsumption(address, source, amount);
    setRecords([...records, record]);
  };

  return { records, create, address };
}
