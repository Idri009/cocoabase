import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createMonitoring,
  type PestMonitoring,
} from '@/lib/onchain-farm-pest-monitoring-utils';

/**
 * Hook for onchain farm pest monitoring
 * Uses Reown wallet for all transactions
 */
export function useOnchainFarmPestMonitoring() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [monitorings, setMonitorings] = useState<PestMonitoring[]>([]);

  const recordPestSighting = async (
    plantationId: string,
    pestType: string,
    severity: number,
    location: string
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    const monitoring = createMonitoring(address, plantationId, pestType, severity, location);
    setMonitorings([...monitorings, monitoring]);
  };

  const reportTreatment = async (
    contractAddress: Address,
    monitoringId: string,
    treatment: string
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    await writeContract({
      address: contractAddress,
      abi: [],
      functionName: 'reportTreatment',
      args: [monitoringId, treatment],
    });
  };

  return { monitorings, recordPestSighting, reportTreatment, address };
}

