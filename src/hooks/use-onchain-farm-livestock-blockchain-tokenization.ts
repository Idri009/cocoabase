import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createTokenization,
  type Tokenization,
} from '@/lib/onchain-farm-livestock-blockchain-tokenization-utils';

/**
 * Hook for onchain farm livestock blockchain tokenization
 * Uses blockchain wallet for all web3 transactions
 */
export function useOnchainFarmLivestockBlockchainTokenization() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [tokenizations, setTokenizations] = useState<Tokenization[]>([]);

  const tokenize = async (
    animalId: string,
    tokenSymbol: string,
    tokenAmount: bigint,
    tokenizationDate: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Web3 wallet not connected');
    const tokenization = createTokenization(address, animalId, tokenSymbol, tokenAmount, tokenizationDate);
    setTokenizations([...tokenizations, tokenization]);
  };

  const transferToken = async (
    contractAddress: Address,
    tokenizationId: string,
    toAddress: Address,
    amount: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Web3 wallet not connected');
    await writeContract({
      address: contractAddress,
      abi: [],
      functionName: 'transferToken',
      args: [tokenizationId, toAddress, amount],
    });
  };

  return { tokenizations, tokenize, transferToken, address };
}

