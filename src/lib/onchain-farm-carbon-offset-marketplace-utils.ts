import { type Address } from 'viem';

/**
 * Onchain farm carbon offset marketplace utilities
 * Carbon offset listing and trading
 */

export interface CarbonOffsetListing {
  id: string;
  plantationId: string;
  seller: Address;
  carbonAmount: bigint;
  pricePerTon: bigint;
  totalPrice: bigint;
  status: 'listed' | 'sold' | 'cancelled';
  timestamp: bigint;
}

export function createCarbonOffsetListing(
  address: Address,
  plantationId: string,
  carbonAmount: bigint,
  pricePerTon: bigint
): CarbonOffsetListing {
  return {
    id: `${Date.now()}-${Math.random()}`,
    plantationId,
    seller: address,
    carbonAmount,
    pricePerTon,
    totalPrice: carbonAmount * pricePerTon,
    status: 'listed',
    timestamp: BigInt(Date.now()),
  };
}

