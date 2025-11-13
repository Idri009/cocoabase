import { type Address } from 'viem';

/**
 * Onchain farm crop yield analysis utilities
 * Yield analysis creation and reporting
 */

export interface YieldAnalysis {
  id: string;
  plantationId: string;
  analyzedBy: Address;
  actualYield: bigint;
  expectedYield: bigint;
  factors: string[];
  variance?: bigint;
  timestamp: bigint;
}

export function createYieldAnalysis(
  address: Address,
  plantationId: string,
  actualYield: bigint,
  expectedYield: bigint,
  factors: string[]
): YieldAnalysis {
  const variance = actualYield > expectedYield ? actualYield - expectedYield : expectedYield - actualYield;
  return {
    id: `${Date.now()}-${Math.random()}`,
    plantationId,
    analyzedBy: address,
    actualYield,
    expectedYield,
    factors,
    variance,
    timestamp: BigInt(Date.now()),
  };
}

