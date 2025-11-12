import { type Address } from 'viem';

export interface ProductivityRecord {
  id: bigint;
  recorder: Address;
  worker: Address;
  task: string;
  output: bigint;
  hours: bigint;
  timestamp: bigint;
}

export function createProductivityRecord(
  recorder: Address,
  worker: Address,
  task: string,
  output: bigint,
  hours: bigint
): ProductivityRecord {
  return {
    id: BigInt(0),
    recorder,
    worker,
    task,
    output,
    hours,
    timestamp: BigInt(Date.now()),
  };
}
