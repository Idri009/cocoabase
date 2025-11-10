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

export function calculateTimeWeightedAverage(
  positions: TimeWeightedPosition[],
  currentTime: bigint
): bigint {
  let totalWeighted = BigInt(0);
  let totalAmount = BigInt(0);
  for (const position of positions) {
    const timeDiff = currentTime - position.entryTime;
    totalWeighted += position.amount * timeDiff;
    totalAmount += position.amount;
  }
  if (totalAmount === BigInt(0)) return BigInt(0);
  return totalWeighted / totalAmount;
}
