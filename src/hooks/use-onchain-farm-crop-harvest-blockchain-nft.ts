import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createNFTRecord,
  type NFTRecord,
} from '@/lib/onchain-farm-crop-harvest-blockchain-nft-utils';

/**
 * Hook for onchain farm crop harvest blockchain NFT
 * Uses blockchain wallet for all web3 transactions
 */
export function useOnchainFarmCropHarvestBlockchainNFT() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [records, setRecords] = useState<NFTRecord[]>([]);

  const mintNFT = async (
    harvestId: string,
    tokenURI: string,
    metadata: string,
    mintDate: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Web3 wallet not connected');
    const record = createNFTRecord(address, harvestId, tokenURI, metadata, mintDate);
    setRecords([...records, record]);
  };

  const transferNFT = async (
    contractAddress: Address,
    recordId: string,
    toAddress: Address
  ): Promise<void> => {
    if (!address) throw new Error('Web3 wallet not connected');
    await writeContract({
      address: contractAddress,
      abi: [],
      functionName: 'transferNFT',
      args: [recordId, toAddress],
    });
  };

  return { records, mintNFT, transferNFT, address };
}

