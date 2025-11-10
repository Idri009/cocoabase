import { type Address } from 'viem';

/**
 * Onchain escrow utilities
 * Secure payment escrow for transactions
 */

export interface Escrow {
  id: bigint;
  buyer: Address;
  seller: Address;
  amount: bigint;
  token: Address;
  status: 'pending' | 'released' | 'refunded' | 'disputed';
  createdAt: bigint;
  expiresAt: bigint;
}

export function createEscrow(
  buyer: Address,
  seller: Address,
  amount: bigint,
  token: Address,
  duration: bigint
): Escrow {
  const now = BigInt(Date.now());
  return {
    id: BigInt(0),
    buyer,
    seller,
    amount,
    token,
    status: 'pending',
    createdAt: now,
    expiresAt: now + duration,
  };
}

export function isEscrowExpired(
  escrow: Escrow,
  currentTime: bigint
): boolean {
  return currentTime > escrow.expiresAt && escrow.status === 'pending';
}

export function canReleaseEscrow(
  escrow: Escrow,
  releaser: Address
): boolean {
  return (
    escrow.status === 'pending' &&
    (releaser === escrow.buyer || releaser === escrow.seller)
  );
}

export function canRefundEscrow(
  escrow: Escrow,
  requester: Address,
  currentTime: bigint
): boolean {
  return (
    escrow.status === 'pending' &&
    requester === escrow.buyer &&
    (currentTime > escrow.expiresAt || requester === escrow.buyer)
  );
}

export function calculateEscrowFee(
  amount: bigint,
  feePercent: number = 0.01
): bigint {
  return (amount * BigInt(Math.floor(feePercent * 10000))) / BigInt(10000);
}

export function validateEscrowAmount(
  amount: bigint,
  minAmount: bigint = BigInt(0)
): boolean {
  return amount > minAmount;
}
