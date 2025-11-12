import { type Address } from 'viem';

export interface DepreciationRecord {
  id: bigint;
  recorder: Address;
  asset: string;
  initialValue: bigint;
  currentValue: bigint;
  depreciationRate: bigint;
  timestamp: bigint;
}

export function createDepreciationRecord(
  recorder: Address,
  asset: string,
  initialValue: bigint,
  currentValue: bigint,
  depreciationRate: bigint
): DepreciationRecord {
  return {
    id: BigInt(0),
    recorder,
    asset,
    initialValue,
    currentValue,
    depreciationRate,
    timestamp: BigInt(Date.now()),
  };
}
