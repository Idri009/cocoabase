import { type Address } from 'viem';

export interface WaterConservationRecord {
  id: bigint;
  recorder: Address;
  method: string;
  savedAmount: bigint;
  timestamp: bigint;
}

export function createWaterConservationRecord(
  recorder: Address,
  method: string,
  savedAmount: bigint
): WaterConservationRecord {
  return {
    id: BigInt(0),
    recorder,
    method,
    savedAmount,
    timestamp: BigInt(Date.now()),
  };
}

