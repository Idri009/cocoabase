import { type Address } from 'viem';

/**
 * Onchain escrow utilities
 * Escrow contracts and conditional payments
 */

export interface Escrow {
  id: string;
  depositor: Address;
  beneficiary: Address;
  amount: bigint;
  released: boolean;
  disputePeriod: number;
}

/**
 * Check if escrow can be released
 */
export function canReleaseEscrow(escrow: Escrow): boolean {
  return !escrow.released && Date.now() >= escrow.disputePeriod;
}
