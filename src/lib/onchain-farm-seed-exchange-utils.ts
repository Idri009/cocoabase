import { type Address } from 'viem';

/**
 * Onchain farm seed exchange utilities
 * Seed trading and exchange management
 */

export interface SeedTrade {
  id: string;
  seedType: string;
  seller: Address;
  quantity: bigint;
  price: bigint;
  certification: string;
  status: 'listed' | 'sold' | 'cancelled';
  timestamp: bigint;
}

export function createSeedTrade(
  address: Address,
  seedType: string,
  quantity: bigint,
  price: bigint,
  certification: string
): SeedTrade {
  return {
    id: `${Date.now()}-${Math.random()}`,
    seedType,
    seller: address,
    quantity,
    price,
    certification,
    status: 'listed',
    timestamp: BigInt(Date.now()),
  };
}

