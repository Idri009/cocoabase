import { type Address } from 'viem';

/**
 * Onchain time lock utilities
 * Time-locked transactions and delayed execution
 */

export interface TimeLock {
  id: string;
  target: Address;
  value: bigint;
  data: string;
  executeTime: number;
  executed: boolean;
}

/**
 * Check if time lock can be executed
 */
export function canExecuteTimeLock(lock: TimeLock): boolean {
  return !lock.executed && Date.now() >= lock.executeTime;
}

