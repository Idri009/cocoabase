import { type Address } from 'viem';

/**
 * Onchain farm crop harvest blockchain NFT utilities
 * NFT record creation on blockchain
 */

export interface NFTRecord {
  id: string;
  harvestId: string;
  mintedBy: Address;
  tokenURI: string;
  metadata: string;
  mintDate: bigint;
  timestamp: bigint;
}

export function createNFTRecord(
  address: Address,
  harvestId: string,
  tokenURI: string,
  metadata: string,
  mintDate: bigint
): NFTRecord {
  return {
    id: `${Date.now()}-${Math.random()}`,
    harvestId,
    mintedBy: address,
    tokenURI,
    metadata,
    mintDate,
    timestamp: BigInt(Date.now()),
  };
}

