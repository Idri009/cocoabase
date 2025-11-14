import { useState } from 'react';
import { useAccount } from 'wagmi';
import type { Address } from 'viem';
import {
  createEnergyRecord,
  getEnergyBySource,
  calculateTotalEnergy,
  getRecentEnergy,
  type EnergyRecord,
} from '@/lib/onchain-farm-energy-management-utils';

export function useOnchainFarmEnergyManagement() {
  const { address } = useAccount();
  const [records, setRecords] = useState<EnergyRecord[]>([]);

  const record = (
    source: 'solar' | 'wind' | 'grid' | 'biomass',
    amount: bigint
  ) => {
    if (!address) throw new Error('Wallet not connected via Reown');
    const energyRecord = createEnergyRecord(address, source, amount);
    setRecords((prev) => [...prev, energyRecord]);
    console.log('Recording energy:', { source, amount });
  };

  return {
    records,
    record,
    getEnergyBySource,
    calculateTotalEnergy,
    getRecentEnergy,
    address,
  };
}


