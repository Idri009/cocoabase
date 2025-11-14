import { type Address } from 'viem';

/**
 * Onchain farm crop harvest sales utilities
 * Sale creation and confirmation
 */

export interface HarvestSale {
  id: string;
  harvestId: string;
  seller: Address;
  buyer: Address;
  quantity: bigint;
  price: bigint;
  totalPrice: bigint;
  saleDate: bigint;
  confirmed: boolean;
  timestamp: bigint;
}

export function createSale(
  seller: Address,
  harvestId: string,
  buyer: Address,
  quantity: bigint,
  price: bigint,
  saleDate: bigint
): HarvestSale {
  return {
    id: `${Date.now()}-${Math.random()}`,
    harvestId,
    seller,
    buyer,
    quantity,
    price,
    totalPrice: quantity * price,
    saleDate,
    confirmed: false,
    timestamp: BigInt(Date.now()),
  };
}

