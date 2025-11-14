import { type Address } from 'viem';

/**
 * Onchain farm crop harvest payment processing utilities
 * Payment record creation on blockchain
 */

export interface PaymentRecord {
  id: string;
  harvestId: string;
  processedBy: Address;
  payer: Address;
  payee: Address;
  amount: bigint;
  paymentDate: bigint;
  paymentMethod: string;
  confirmed: boolean;
  timestamp: bigint;
}

export function createPaymentRecord(
  address: Address,
  harvestId: string,
  payer: Address,
  payee: Address,
  amount: bigint,
  paymentDate: bigint,
  paymentMethod: string
): PaymentRecord {
  return {
    id: `${Date.now()}-${Math.random()}`,
    harvestId,
    processedBy: address,
    payer,
    payee,
    amount,
    paymentDate,
    paymentMethod,
    confirmed: false,
    timestamp: BigInt(Date.now()),
  };
}

