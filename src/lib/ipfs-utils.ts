/**
 * IPFS integration utilities for decentralized storage
 * Upload, pin, and retrieve metadata from IPFS
 */

export interface IPFSUploadResult {
  hash: string;
  url: string;
  gateway: string;
}

export interface IPFSMetadata {
  name: string;
  description: string;
  image?: string;
  attributes: Record<string, unknown>;
}

/**
 * Format IPFS hash to gateway URL
 */
export function formatIPFSURL(
  hash: string,
  gateway: string = 'https://ipfs.io/ipfs/'
): string {
  return `${gateway}${hash}`;
}

/**
 * Parse IPFS URL to extract hash
 */
export function parseIPFSURL(url: string): string | null {
  const match = url.match(/ipfs\/([a-zA-Z0-9]+)/);
  return match ? match[1] : null;
}

