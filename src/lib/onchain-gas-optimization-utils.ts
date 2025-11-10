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

export function optimizeGasUsage(
  contract: Address,
  functionName: string,
  gasBefore: bigint,
  gasAfter: bigint
): GasOptimization {
  return {
    contract,
    function: functionName,
    gasBefore,
    gasAfter,
    savings: calculateGasSavings(gasBefore, gasAfter),
  };
}

export function calculateGasEfficiency(
  optimization: GasOptimization
): number {
  if (optimization.gasBefore === BigInt(0)) return 0;
  return Number((optimization.savings * BigInt(10000)) / optimization.gasBefore) / 100;
}
