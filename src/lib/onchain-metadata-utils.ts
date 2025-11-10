import { type Address } from 'viem';

export interface Metadata {
  id: string;
  contract: Address;
  tokenId: bigint;
  name: string;
  description: string;
  image: string;
  attributes: Record<string, unknown>;
  ipfsHash: string;
}

export function createMetadata(
  contract: Address,
  tokenId: bigint,
  name: string,
  description: string,
  image: string,
  attributes: Record<string, unknown>,
  ipfsHash: string
): Metadata {
  return {
    id: `${contract}-${tokenId}`,
    contract,
    tokenId,
    name,
    description,
    image,
    attributes,
    ipfsHash,
  };
}

export function updateMetadata(
  metadata: Metadata,
  updates: Partial<Metadata>
): Metadata {
  return { ...metadata, ...updates };
}

export function validateMetadata(metadata: Metadata): boolean {
  return (
    metadata.name.length > 0 &&
    metadata.description.length > 0 &&
    metadata.image.length > 0 &&
    metadata.ipfsHash.length > 0
  );
}
