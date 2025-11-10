import { type Address } from 'viem';

export interface Settlement {
  id: bigint;
  partyA: Address;
  partyB: Address;
  amountA: bigint;
  amountB: bigint;
  tokenA: Address;
  tokenB: Address;
  status: 'pending' | 'settled' | 'disputed' | 'cancelled';
  createdAt: bigint;
  settledAt?: bigint;
}

export function createSettlement(
  partyA: Address,
  partyB: Address,
  amountA: bigint,
  amountB: bigint,
  tokenA: Address,
  tokenB: Address
): Settlement {
  const now = BigInt(Date.now());
  return {
    id: BigInt(0),
    partyA,
    partyB,
    amountA,
    amountB,
    tokenA,
    tokenB,
    status: 'pending',
    createdAt: now,
  };
}

export function settle(
  settlement: Settlement,
  settler: Address,
  currentTime: bigint
): Settlement | null {
  if (settlement.status !== 'pending') return null;
  if (settler !== settlement.partyA && settler !== settlement.partyB) return null;

  return {
    ...settlement,
    status: 'settled',
    settledAt: currentTime,
  };
}

export function disputeSettlement(
  settlement: Settlement,
  disputer: Address
): Settlement | null {
  if (settlement.status !== 'pending') return null;
  if (disputer !== settlement.partyA && disputer !== settlement.partyB) return null;

  return {
    ...settlement,
    status: 'disputed',
  };
}

export function cancelSettlement(
  settlement: Settlement,
  canceller: Address
): Settlement | null {
  if (settlement.status !== 'pending') return null;
  if (canceller !== settlement.partyA && canceller !== settlement.partyB) return null;

  return {
    ...settlement,
    status: 'cancelled',
  };
}

export function calculateNetAmount(
  settlement: Settlement,
  party: Address
): { amount: bigint; token: Address } | null {
  if (party === settlement.partyA) {
    return {
      amount: settlement.amountB - settlement.amountA,
      token: settlement.tokenB,
    };
  } else if (party === settlement.partyB) {
    return {
      amount: settlement.amountA - settlement.amountB,
      token: settlement.tokenA,
    };
  }
  return null;
}

