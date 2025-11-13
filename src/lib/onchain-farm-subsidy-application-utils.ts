import { type Address } from 'viem';

/**
 * Onchain farm subsidy application utilities
 * Subsidy application creation and approval
 */

export interface SubsidyApplication {
  id: string;
  plantationId: string;
  applicant: Address;
  subsidyType: string;
  requestedAmount: bigint;
  justification: string;
  status: 'pending' | 'approved' | 'rejected';
  timestamp: bigint;
}

export function createSubsidyApplication(
  address: Address,
  plantationId: string,
  subsidyType: string,
  requestedAmount: bigint,
  justification: string
): SubsidyApplication {
  return {
    id: `${Date.now()}-${Math.random()}`,
    plantationId,
    applicant: address,
    subsidyType,
    requestedAmount,
    justification,
    status: 'pending',
    timestamp: BigInt(Date.now()),
  };
}

