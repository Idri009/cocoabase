import { type Address } from 'viem';

/**
 * Onchain farm crop harvest pricing utilities
 * Pricing record creation on blockchain
 */

export interface PricingRecord {
  id: string;
  harvestId: string;
  setBy: Address;
  price: bigint;
  currency: string;
  pricingDate: bigint;
  market: string;
  timestamp: bigint;
}

export function createPricingRecord(
  address: Address,
  harvestId: string,
  price: bigint,
  currency: string,
  pricingDate: bigint,
  market: string
): PricingRecord {
  return {
    id: `${Date.now()}-${Math.random()}`,
    harvestId,
    setBy: address,
    price,
    currency,
    pricingDate,
    market,
    timestamp: BigInt(Date.now()),
  };
}

