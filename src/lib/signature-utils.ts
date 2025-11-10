import { type Address } from 'viem';

/**
 * EIP-712 signature utilities
 * Create and verify typed data signatures
 */

export interface TypedDataDomain {
  name: string;
  version: string;
  chainId: number;
  verifyingContract: Address;
}

export interface TypedDataField {
  name: string;
  type: string;
}

export interface SignatureData {
  domain: TypedDataDomain;
  types: Record<string, TypedDataField[]>;
  message: Record<string, unknown>;
}

/**
 * Create EIP-712 domain
 */
export function createTypedDataDomain(
  name: string,
  version: string,
  chainId: number,
  verifyingContract: Address
): TypedDataDomain {
  return { name, version, chainId, verifyingContract };
}

/**
 * Create plantation signature types
 */
export function createPlantationSignatureTypes(): Record<string, TypedDataField[]> {
  return {
    Plantation: [
      { name: 'id', type: 'string' },
      { name: 'location', type: 'string' },
      { name: 'area', type: 'uint256' },
      { name: 'stage', type: 'string' },
    ],
  };
}

/**
 * Format signature for display
 */
export function formatSignature(signature: string): string {
  return `${signature.slice(0, 10)}...${signature.slice(-8)}`;
}

