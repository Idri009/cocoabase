import { type Address } from 'viem';

export interface TimeWeightedPosition {
  user: Address;
  amount: bigint;
  entryTime: bigint;
  weightedAmount: bigint;
}

export function createTimeWeightedPosition(
  user: Address,
  amount: bigint,
  entryTime: bigint
): TimeWeightedPosition {
  return {
    user,
    amount,
    entryTime,
    weightedAmount: amount * entryTime,
  };
}

