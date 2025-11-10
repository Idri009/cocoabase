import { type Address } from 'viem';

export interface GasOptimization {
  contract: Address;
  function: string;
  gasBefore: bigint;
  gasAfter: bigint;
  savings: bigint;
}

export function calculateGasSavings(
  gasBefore: bigint,
  gasAfter: bigint
): bigint {
  return gasBefore > gasAfter ? gasBefore - gasAfter : BigInt(0);
}

