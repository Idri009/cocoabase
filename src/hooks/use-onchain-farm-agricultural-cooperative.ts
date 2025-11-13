import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createCooperative,
  type AgriculturalCooperative,
} from '@/lib/onchain-farm-agricultural-cooperative-utils';

/**
 * Hook for onchain farm agricultural cooperative
 * Uses Reown wallet for all transactions
 */
export function useOnchainFarmAgriculturalCooperative() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [cooperatives, setCooperatives] = useState<AgriculturalCooperative[]>([]);

  const createCoop = async (
    coopName: string,
    description: string,
    membershipFee: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    const coop = createCooperative(address, coopName, description, membershipFee);
    setCooperatives([...cooperatives, coop]);
  };

  const joinCooperative = async (
    contractAddress: Address,
    coopId: string
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    await writeContract({
      address: contractAddress,
      abi: [],
      functionName: 'joinCooperative',
      args: [coopId],
    });
  };

  return { cooperatives, createCoop, joinCooperative, address };
}

