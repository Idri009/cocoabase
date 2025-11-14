import { type Address } from 'viem';

export interface CarbonSequestration {
  id: string;
  plantationId: bigint;
  carbonAmount: bigint;
  measurementDate: bigint;
  soilType: string;
  measurer: Address;
  verified: boolean;
  creditsEarned: bigint;
}

export function createCarbonSequestration(
  address: Address,
  plantationId: bigint,
  carbonAmount: bigint,
  soilType: string
): CarbonSequestration {
  const creditsEarned = carbonAmount / BigInt(1000);
  return {
    id: `${Date.now()}-${Math.random()}`,
    plantationId,
    carbonAmount,
    measurementDate: BigInt(Date.now()),
    soilType,
    measurer: address,
    verified: false,
    creditsEarned,
  };
}
