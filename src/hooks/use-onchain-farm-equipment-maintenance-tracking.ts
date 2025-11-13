import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createMaintenanceRecord,
  type MaintenanceRecord,
} from '@/lib/onchain-farm-equipment-maintenance-tracking-utils';

/**
 * Hook for onchain farm equipment maintenance tracking
 * Uses Reown wallet for all transactions
 */
export function useOnchainFarmEquipmentMaintenanceTracking() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [records, setRecords] = useState<MaintenanceRecord[]>([]);

  const recordMaintenance = async (
    equipmentId: string,
    maintenanceType: string,
    cost: bigint,
    nextMaintenanceDate: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    const record = createMaintenanceRecord(address, equipmentId, maintenanceType, cost, nextMaintenanceDate);
    setRecords([...records, record]);
  };

  const completeMaintenance = async (
    contractAddress: Address,
    recordId: string
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    await writeContract({
      address: contractAddress,
      abi: [],
      functionName: 'completeMaintenance',
      args: [recordId],
    });
  };

  return { records, recordMaintenance, completeMaintenance, address };
}

