import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createPauseRecord,
  type PauseRecord,
} from '@/lib/onchain-farm-crop-harvest-blockchain-pausable-utils';

/**
 * Hook for onchain farm crop harvest blockchain pausable
 * Uses blockchain wallet for all web3 transactions
 */
export function useOnchainFarmCropHarvestBlockchainPausable() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [records, setRecords] = useState<PauseRecord[]>([]);

  const pause = async (
    harvestId: string,
    pauseReason: string,
    pauseDate: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Web3 wallet not connected');
    const record = createPauseRecord(address, harvestId, pauseReason, pauseDate);
    setRecords([...records, record]);
  };

  const unpause = async (
    contractAddress: Address,
    recordId: string
  ): Promise<void> => {
    if (!address) throw new Error('Web3 wallet not connected');
    await writeContract({
      address: contractAddress,
      abi: [],
      functionName: 'unpause',
      args: [recordId],
    });
  };

  return { records, pause, unpause, address };
}

