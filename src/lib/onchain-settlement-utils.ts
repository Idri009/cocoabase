import { type Address } from 'viem';

/**
 * Onchain settlement utilities
 * Peer-to-peer transaction settlement
 */

export interface Settlement {
  id: bigint;
  payer: Address;
  payee: Address;
  amount: bigint;
  status: 'pending' | 'settled' | 'disputed';
  createdAt: bigint;
}

export function canSettle(
  settlement: Settlement,
  requester: Address
): boolean {
  return settlement.status === 'pending' && 
         (requester === settlement.payer || requester === settlement.payee);
}
