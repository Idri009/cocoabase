import { type Address } from 'viem';

/**
 * Onchain farm crop insurance claims utilities
 * Insurance claim filing and processing
 */

export interface InsuranceClaim {
  id: string;
  policyId: string;
  filedBy: Address;
  damageAmount: bigint;
  damageType: string;
  incidentDate: bigint;
  description: string;
  status: 'pending' | 'approved' | 'rejected' | 'paid';
  timestamp: bigint;
}

export function createClaim(
  address: Address,
  policyId: string,
  damageAmount: bigint,
  damageType: string,
  incidentDate: bigint,
  description: string
): InsuranceClaim {
  return {
    id: `${Date.now()}-${Math.random()}`,
    policyId,
    filedBy: address,
    damageAmount,
    damageType,
    incidentDate,
    description,
    status: 'pending',
    timestamp: BigInt(Date.now()),
  };
}

