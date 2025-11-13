import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createExtensionService,
  type ExtensionService,
} from '@/lib/onchain-farm-agricultural-extension-utils';

/**
 * Hook for onchain farm agricultural extension services
 * Uses Reown wallet for all transactions
 */
export function useOnchainFarmAgriculturalExtension() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [services, setServices] = useState<ExtensionService[]>([]);

  const requestService = async (
    serviceType: string,
    description: string,
    requestedDate: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    const service = createExtensionService(address, serviceType, description, requestedDate);
    setServices([...services, service]);
  };

  const completeService = async (
    contractAddress: Address,
    serviceId: string,
    outcome: string
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    await writeContract({
      address: contractAddress,
      abi: [],
      functionName: 'completeService',
      args: [serviceId, outcome],
    });
  };

  return { services, requestService, completeService, address };
}

