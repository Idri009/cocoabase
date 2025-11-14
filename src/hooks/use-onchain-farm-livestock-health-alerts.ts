import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createHealthAlert,
  type HealthAlert,
} from '@/lib/onchain-farm-livestock-health-alerts-utils';

/**
 * Hook for onchain farm livestock health alerts
 * Uses blockchain wallet for all web3 transactions
 */
export function useOnchainFarmLivestockHealthAlerts() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [alerts, setAlerts] = useState<HealthAlert[]>([]);

  const createAlert = async (
    animalId: string,
    alertType: string,
    severity: string,
    message: string,
    alertDate: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Web3 wallet not connected');
    const alert = createHealthAlert(address, animalId, alertType, severity, message, alertDate);
    setAlerts([...alerts, alert]);
  };

  const acknowledgeAlert = async (
    contractAddress: Address,
    alertId: string
  ): Promise<void> => {
    if (!address) throw new Error('Web3 wallet not connected');
    await writeContract({
      address: contractAddress,
      abi: [],
      functionName: 'acknowledgeAlert',
      args: [alertId],
    });
  };

  return { alerts, createAlert, acknowledgeAlert, address };
}

