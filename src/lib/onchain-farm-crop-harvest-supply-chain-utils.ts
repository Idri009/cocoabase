import { type Address } from 'viem';

/**
 * Onchain farm crop harvest supply chain utilities
 * Supply chain link creation on blockchain
 */

export interface SupplyChainLink {
  id: string;
  harvestId: string;
  createdBy: Address;
  supplier: Address;
  receiver: Address;
  transferDate: bigint;
  productInfo: string;
  verified: boolean;
  timestamp: bigint;
}

export function createSupplyChainLink(
  address: Address,
  harvestId: string,
  supplier: Address,
  receiver: Address,
  transferDate: bigint,
  productInfo: string
): SupplyChainLink {
  return {
    id: `${Date.now()}-${Math.random()}`,
    harvestId,
    createdBy: address,
    supplier,
    receiver,
    transferDate,
    productInfo,
    verified: false,
    timestamp: BigInt(Date.now()),
  };
}

