import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createTransportLogistic,
  type TransportLogistic,
} from '@/lib/onchain-farm-crop-harvest-transport-logistics-utils';

/**
 * Hook for onchain farm crop harvest transport logistics
 * Uses blockchain wallet for all web3 transactions
 */
export function useOnchainFarmCropHarvestTransportLogistics() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [logistics, setLogistics] = useState<TransportLogistic[]>([]);

  const createLogistic = async (
    harvestId: string,
    vehicleType: string,
    driver: string,
    origin: string,
    destination: string,
    transportDate: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Web3 wallet not connected');
    const logistic = createTransportLogistic(address, harvestId, vehicleType, driver, origin, destination, transportDate);
    setLogistics([...logistics, logistic]);
  };

  const completeTransport = async (
    contractAddress: Address,
    logisticId: string
  ): Promise<void> => {
    if (!address) throw new Error('Web3 wallet not connected');
    await writeContract({
      address: contractAddress,
      abi: [],
      functionName: 'completeTransport',
      args: [logisticId],
    });
  };

  return { logistics, createLogistic, completeTransport, address };
}

