import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createSupplyChainLink,
  type SupplyChainLink,
} from '@/lib/onchain-farm-crop-harvest-supply-chain-utils';

/**
 * Hook for onchain farm crop harvest supply chain
 * Uses blockchain wallet for all web3 transactions
 */
export function useOnchainFarmCropHarvestSupplyChain() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [links, setLinks] = useState<SupplyChainLink[]>([]);

  const createLink = async (
    harvestId: string,
    supplier: Address,
    receiver: Address,
    transferDate: bigint,
    productInfo: string
  ): Promise<void> => {
    if (!address) throw new Error('Web3 wallet not connected');
    const link = createSupplyChainLink(address, harvestId, supplier, receiver, transferDate, productInfo);
    setLinks([...links, link]);
  };

  const verifyLink = async (
    contractAddress: Address,
    linkId: string
  ): Promise<void> => {
    if (!address) throw new Error('Web3 wallet not connected');
    await writeContract({
      address: contractAddress,
      abi: [],
      functionName: 'verifyLink',
      args: [linkId],
    });
  };

  return { links, createLink, verifyLink, address };
}

