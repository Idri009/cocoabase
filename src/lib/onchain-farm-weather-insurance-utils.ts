import { type Address } from 'viem';

export interface InsurancePolicy {
  id: string;
  plantationId: bigint;
  coverageAmount: bigint;
  premium: bigint;
  startDate: bigint;
  endDate: bigint;
  weatherConditions: string;
  policyholder: Address;
  active: boolean;
  claimed: boolean;
}

export function createInsurancePolicy(
  address: Address,
  plantationId: bigint,
  coverageAmount: bigint,
  premium: bigint,
  endDate: bigint,
  weatherConditions: string
): InsurancePolicy {
  return {
    id: `${Date.now()}-${Math.random()}`,
    plantationId,
    coverageAmount,
    premium,
    startDate: BigInt(Date.now()),
    endDate,
    weatherConditions,
    policyholder: address,
    active: true,
    claimed: false,
  };
}
