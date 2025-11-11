import { useState } from 'react';
import { useAccount } from 'wagmi';
import type { Address } from 'viem';
import {
  recordMaintenance,
  type MaintenanceRecord,
} from '@/lib/onchain-farm-equipment-maintenance-records-utils';

export function useOnchainFarmEquipmentMaintenanceRecords() {
  const { address } = useAccount();
  const [records, setRecords] = useState<MaintenanceRecord[]>([]);

  const record = async (
    equipmentId: bigint,
    maintenanceType: string,
    cost: bigint,
    technician: Address
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected');
    const maintenance = recordMaintenance(address, equipmentId, maintenanceType, cost, technician);
    setRecords([...records, maintenance]);
  };

  return { records, record, address };
}
