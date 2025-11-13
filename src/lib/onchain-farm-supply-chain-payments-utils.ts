import { type Address } from 'viem';

/**
 * Onchain farm supply chain payments utilities
 * Supply chain payment processing
 */

export interface SupplyChainPayment {
  id: string;
  buyer: Address;
  supplier: Address;
  amount: bigint;
  orderId: string;
  status: 'pending' | 'confirmed' | 'rejected';
  timestamp: bigint;
}

export function createPayment(
  buyer: Address,
  supplier: Address,
  amount: bigint,
  orderId: string
): SupplyChainPayment {
  return {
    id: `${Date.now()}-${Math.random()}`,
    buyer,
    supplier,
    amount,
    orderId,
    status: 'pending',
    timestamp: BigInt(Date.now()),
  };
}

