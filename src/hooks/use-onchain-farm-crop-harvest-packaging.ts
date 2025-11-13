import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createPackagingRecord,
  type HarvestPackaging,
} from '@/lib/onchain-farm-crop-harvest-packaging-utils';

/**
 * Hook for onchain farm crop harvest packaging
 * Uses Reown wallet for all transactions
 */
export function useOnchainFarmCropHarvestPackaging() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [packagings, setPackagings] = useState<HarvestPackaging[]>([]);

  const recordPackaging = async (
    harvestId: string,
    packageType: string,
    quantity: number,
    packagingDate: bigint,
    label: string
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    const packaging = createPackagingRecord(address, harvestId, packageType, quantity, packagingDate, label);
    setPackagings([...packagings, packaging]);
  };

  const verifyPackaging = async (
    contractAddress: Address,
    packagingId: string
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    await writeContract({
      address: contractAddress,
      abi: [],
      functionName: 'verifyPackaging',
      args: [packagingId],
    });
  };

  return { packagings, recordPackaging, verifyPackaging, address };
}

