import { type Address } from 'viem';

/**
 * Onchain farm labor payment escrow utilities
 * Escrow payment creation and management
 */

export interface PaymentEscrow {
  id: string;
  employer: Address;
  worker: Address;
  amount: bigint;
  workDescription: string;
  status: 'pending' | 'released' | 'disputed' | 'cancelled';
  timestamp: bigint;
}

export function createEscrow(
  employer: Address,
  worker: Address,
  amount: bigint,
  workDescription: string
): PaymentEscrow {
  return {
    id: `${Date.now()}-${Math.random()}`,
    employer,
    worker,
    amount,
    workDescription,
    status: 'pending',
    timestamp: BigInt(Date.now()),
  };
}

