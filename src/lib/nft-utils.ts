import { type Address, type Hash } from 'viem';

/**
 * Onchain NFT utilities for plantation tokenization
 * Mint, transfer, and manage plantation NFTs onchain
 */

export interface PlantationNFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes: {
    location: string;
    area: number;
    stage: string;
    healthScore: number;
    mintDate: string;
  };
}

export interface MintPlantationNFTParams {
  to: Address;
  metadata: PlantationNFTMetadata;
  tokenId?: bigint;
}

export interface NFTMintResult {
  txHash: Hash;
  tokenId: bigint;
  contractAddress: Address;
}

/**
 * Prepare NFT metadata for IPFS upload
 */
export function prepareNFTMetadata(
  plantation: PlantationNFTMetadata
): string {
  return JSON.stringify({
    name: plantation.name,
    description: plantation.description,
    image: plantation.image,
    attributes: plantation.attributes,
  });
}

/**
 * Validate NFT metadata before minting
 */
export function validateNFTMetadata(
  metadata: PlantationNFTMetadata
): boolean {
  return !!(
    metadata.name &&
    metadata.description &&
    metadata.image &&
    metadata.attributes.location &&
    metadata.attributes.area > 0
  );
}

/**
 * Generate token ID for plantation NFT
 */
export function generateTokenId(plantationId: string): bigint {
  const hash = plantationId.split('').reduce((acc, char) => {
    return ((acc << 5) - acc + char.charCodeAt(0)) | 0;
  }, 0);
  return BigInt(Math.abs(hash));
}

