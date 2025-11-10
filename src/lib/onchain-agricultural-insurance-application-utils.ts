import { type Address } from 'viem';

export interface InsuranceApplication {
  id: bigint;
  applicant: Address;
  plantationId: bigint;
  insuranceType: 'crop' | 'livestock' | 'equipment' | 'liability';
  coverageAmount: bigint;
  premium: bigint;
  applicationDate: bigint;
  status: 'pending' | 'approved' | 'rejected' | 'active';
  txHash: string;
}

export function createInsuranceApplication(
  applicant: Address,
  plantationId: bigint,
  insuranceType: InsuranceApplication['insuranceType'],
  coverageAmount: bigint,
  premium: bigint
): InsuranceApplication {
  return {
    id: BigInt(Date.now()),
    applicant,
    plantationId,
    insuranceType,
    coverageAmount,
    premium,
    applicationDate: BigInt(Date.now()),
    status: 'pending',
    txHash: '',
  };
}
