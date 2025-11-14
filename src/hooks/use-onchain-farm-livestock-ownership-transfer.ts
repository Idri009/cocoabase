import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createOwnershipTransfer,
  type OwnershipTransfer,
} from '@/lib/onchain-farm-livestock-ownership-transfer-utils';

/**
 * Hook for onchain farm livestock ownership transfer
 * Uses blockchain wallet for all web3 transactions
 */
export function useOnchainFarmLivestockOwnershipTransfer() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [transfers, setTransfers] = useState<OwnershipTransfer[]>([]);

  const transferOwnership = async (
    animalId: string,
    fromOwner: Address,
    toOwner: Address,
    transferDate: bigint,
    transferReason: string
  ): Promise<void> => {
    if (!address) throw new Error('Web3 wallet not connected');
    const transfer = createOwnershipTransfer(address, animalId, fromOwner, toOwner, transferDate, transferReason);
    setTransfers([...transfers, transfer]);
  };

  const confirmTransfer = async (
    contractAddress: Address,
    transferId: string
  ): Promise<void> => {
    if (!address) throw new Error('Web3 wallet not connected');
    await writeContract({
      address: contractAddress,
      abi: [],
      functionName: 'confirmTransfer',
      args: [transferId],
    });
  };

  return { transfers, transferOwnership, confirmTransfer, address };
}

