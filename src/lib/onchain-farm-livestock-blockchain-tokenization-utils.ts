import { type Address } from 'viem';

/**
 * Onchain farm livestock blockchain tokenization utilities
 * Tokenization creation on blockchain
 */

export interface Tokenization {
  id: string;
  animalId: string;
  tokenizedBy: Address;
  tokenSymbol: string;
  tokenAmount: bigint;
  tokenizationDate: bigint;
  timestamp: bigint;
}

export function createTokenization(
  address: Address,
  animalId: string,
  tokenSymbol: string,
  tokenAmount: bigint,
  tokenizationDate: bigint
): Tokenization {
  return {
    id: `${Date.now()}-${Math.random()}`,
    animalId,
    tokenizedBy: address,
    tokenSymbol,
    tokenAmount,
    tokenizationDate,
    timestamp: BigInt(Date.now()),
  };
}

