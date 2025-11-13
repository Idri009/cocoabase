import { type Address } from 'viem';

/**
 * Onchain farm labor productivity utilities
 * Labor productivity tracking and efficiency calculation
 */

export interface ProductivityRecord {
  id: string;
  employer: Address;
  worker: Address;
  task: string;
  output: bigint;
  hoursWorked: number;
  efficiency?: number;
  timestamp: bigint;
}

export function createProductivityRecord(
  employer: Address,
  worker: Address,
  task: string,
  output: bigint,
  hoursWorked: number
): ProductivityRecord {
  return {
    id: `${Date.now()}-${Math.random()}`,
    employer,
    worker,
    task,
    output,
    hoursWorked,
    timestamp: BigInt(Date.now()),
  };
}

