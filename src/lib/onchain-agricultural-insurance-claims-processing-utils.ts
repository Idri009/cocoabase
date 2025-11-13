import { type Address } from 'viem';

export interface InsuranceClaim {
  id: bigint;
  claimant: Address;
  claimType: string;
  amount: bigint;
  status: 'pending' | 'approved' | 'rejected';
  timestamp: bigint;
}

export function createClaim(
  claimant: Address,
  claimType: string,
  amount: bigint
): InsuranceClaim {
  return {
    id: BigInt(Date.now()),
    claimant,
    claimType,
    amount,
    status: 'pending',
    timestamp: BigInt(Date.now()),
  };
}
