import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createEscrow,
  type Escrow,
} from '@/lib/onchain-farm-crop-harvest-blockchain-escrow-utils';

/**
 * Hook for onchain farm crop harvest blockchain escrow
 * Uses blockchain wallet for all web3 transactions
 */
export function useOnchainFarmCropHarvestBlockchainEscrow() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [escrows, setEscrows] = useState<Escrow[]>([]);

  const createEscrow = async (
    harvestId: string,
    buyer: Address,
    seller: Address,
    amount: bigint,
    releaseDate: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Web3 wallet not connected');
    const escrow = createEscrow(address, harvestId, buyer, seller, amount, releaseDate);
    setEscrows([...escrows, escrow]);
  };

  const releaseEscrow = async (
    contractAddress: Address,
    escrowId: string
  ): Promise<void> => {
    if (!address) throw new Error('Web3 wallet not connected');
    await writeContract({
      address: contractAddress,
      abi: [],
      functionName: 'releaseEscrow',
      args: [escrowId],
    });
  };

  return { escrows, createEscrow, releaseEscrow, address };
}

