import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createTransportRecord,
  type HarvestTransport,
} from '@/lib/onchain-farm-crop-harvest-transport-utils';

/**
 * Hook for onchain farm crop harvest transport
 * Uses Reown wallet for all transactions
 */
export function useOnchainFarmCropHarvestTransport() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [transports, setTransports] = useState<HarvestTransport[]>([]);

  const createTransport = async (
    harvestId: string,
    vehicleType: string,
    driver: Address,
    destination: string,
    transportDate: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    const transport = createTransportRecord(address, harvestId, vehicleType, driver, destination, transportDate);
    setTransports([...transports, transport]);
  };

  const completeTransport = async (
    contractAddress: Address,
    transportId: string
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    await writeContract({
      address: contractAddress,
      abi: [],
      functionName: 'completeTransport',
      args: [transportId],
    });
  };

  return { transports, createTransport, completeTransport, address };
}

