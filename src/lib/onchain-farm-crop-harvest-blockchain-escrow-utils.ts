import { type Address } from 'viem';

/**
 * Onchain farm crop harvest blockchain escrow utilities
 * Escrow creation on blockchain
 */

export interface Escrow {
  id: string;
  harvestId: string;
  createdBy: Address;
  buyer: Address;
  seller: Address;
  amount: bigint;
  releaseDate: bigint;
  released: boolean;
  timestamp: bigint;
}

export function createEscrow(
  address: Address,
  harvestId: string,
  buyer: Address,
  seller: Address,
  amount: bigint,
  releaseDate: bigint
): Escrow {
  return {
    id: `${Date.now()}-${Math.random()}`,
    harvestId,
    createdBy: address,
    buyer,
    seller,
    amount,
    releaseDate,
    released: false,
    timestamp: BigInt(Date.now()),
  };
}

