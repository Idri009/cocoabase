import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createLogisticsRecord,
  type HarvestLogistics,
} from '@/lib/onchain-farm-crop-harvest-logistics-utils';

/**
 * Hook for onchain farm crop harvest logistics
 * Uses Reown wallet for all transactions
 */
export function useOnchainFarmCropHarvestLogistics() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [logistics, setLogistics] = useState<HarvestLogistics[]>([]);

  const createLogistics = async (
    harvestId: string,
    transportMethod: string,
    destination: string,
    estimatedArrival: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    const logisticsRecord = createLogisticsRecord(address, harvestId, transportMethod, destination, estimatedArrival);
    setLogistics([...logistics, logisticsRecord]);
  };

  const confirmDelivery = async (
    contractAddress: Address,
    logisticsId: string
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    await writeContract({
      address: contractAddress,
      abi: [],
      functionName: 'confirmDelivery',
      args: [logisticsId],
    });
  };

  return { logistics, createLogistics, confirmDelivery, address };
}

