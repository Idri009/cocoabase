import { type Address } from 'viem';

/**
 * Onchain farm water quality monitoring utilities
 * Water quality test creation and verification
 */

export interface WaterQualityTest {
  id: string;
  plantationId: string;
  testedBy: Address;
  phLevel: number;
  dissolvedOxygen: bigint;
  turbidity: number;
  contaminants: string[];
  verified: boolean;
  timestamp: bigint;
}

export function createWaterQualityTest(
  address: Address,
  plantationId: string,
  phLevel: number,
  dissolvedOxygen: bigint,
  turbidity: number,
  contaminants: string[]
): WaterQualityTest {
  return {
    id: `${Date.now()}-${Math.random()}`,
    plantationId,
    testedBy: address,
    phLevel,
    dissolvedOxygen,
    turbidity,
    contaminants,
    verified: false,
    timestamp: BigInt(Date.now()),
  };
}

