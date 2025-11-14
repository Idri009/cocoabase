import { type Address } from 'viem';

/**
 * Onchain farm crop harvest shipping utilities
 * Shipping record creation on blockchain
 */

export interface ShippingRecord {
  id: string;
  harvestId: string;
  createdBy: Address;
  carrier: string;
  trackingNumber: string;
  destination: string;
  shippingDate: bigint;
  delivered: boolean;
  timestamp: bigint;
}

export function createShippingRecord(
  address: Address,
  harvestId: string,
  carrier: string,
  trackingNumber: string,
  destination: string,
  shippingDate: bigint
): ShippingRecord {
  return {
    id: `${Date.now()}-${Math.random()}`,
    harvestId,
    createdBy: address,
    carrier,
    trackingNumber,
    destination,
    shippingDate,
    delivered: false,
    timestamp: BigInt(Date.now()),
  };
}

