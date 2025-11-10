import { type Address } from 'viem';

export interface VestingSchedule {
  id: bigint;
  beneficiary: Address;
  token: Address;
  totalAmount: bigint;
  startTime: bigint;
  duration: bigint;
  cliff: bigint;
  released: bigint;
}

export function createVestingSchedule(
  beneficiary: Address,
  token: Address,
  totalAmount: bigint,
  startTime: bigint,
  duration: bigint,
  cliff: bigint
): VestingSchedule {
  return {
    id: BigInt(0),
    beneficiary,
    token,
    totalAmount,
    startTime,
    duration,
    cliff,
    released: BigInt(0),
  };
}

