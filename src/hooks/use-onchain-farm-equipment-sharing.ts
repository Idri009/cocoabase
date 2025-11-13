import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createSharing,
  type EquipmentSharing,
} from '@/lib/onchain-farm-equipment-sharing-utils';

/**
 * Hook for onchain farm equipment sharing
 * Uses Reown wallet for all transactions
 */
export function useOnchainFarmEquipmentSharing() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [sharings, setSharings] = useState<EquipmentSharing[]>([]);

  const shareEquipment = async (
    equipmentId: string,
    borrower: Address,
    duration: number,
    fee: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    const sharing = createSharing(address, equipmentId, borrower, duration, fee);
    setSharings([...sharings, sharing]);
  };

  const confirmSharing = async (
    contractAddress: Address,
    sharingId: string
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    await writeContract({
      address: contractAddress,
      abi: [],
      functionName: 'confirmSharing',
      args: [sharingId],
    });
  };

  return { sharings, shareEquipment, confirmSharing, address };
}

