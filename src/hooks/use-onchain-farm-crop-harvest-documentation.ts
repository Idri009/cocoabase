import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createDocumentation,
  type HarvestDocumentation,
} from '@/lib/onchain-farm-crop-harvest-documentation-utils';

/**
 * Hook for onchain farm crop harvest documentation
 * Uses Reown wallet for all transactions
 */
export function useOnchainFarmCropHarvestDocumentation() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [documentations, setDocumentations] = useState<HarvestDocumentation[]>([]);

  const createDocumentation = async (
    harvestId: string,
    documentType: string,
    documentHash: string,
    description: string,
    documentDate: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    const documentation = createDocumentation(address, harvestId, documentType, documentHash, description, documentDate);
    setDocumentations([...documentations, documentation]);
  };

  const verifyDocumentation = async (
    contractAddress: Address,
    documentationId: string
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    await writeContract({
      address: contractAddress,
      abi: [],
      functionName: 'verifyDocumentation',
      args: [documentationId],
    });
  };

  return { documentations, createDocumentation, verifyDocumentation, address };
}

