import { type Address } from 'viem';

export interface FarmSubsidyClaim {
  id: bigint;
  claimant: Address;
  plantationId: bigint;
  subsidyType: string;
  amount: bigint;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: bigint;
  txHash: string;
}

export function submitSubsidyClaim(
  claimant: Address,
  plantationId: bigint,
  subsidyType: string,
  amount: bigint
): FarmSubsidyClaim {
  return {
    id: BigInt(Date.now()),
    claimant,
    plantationId,
    subsidyType,
    amount,
    status: 'pending',
    submittedAt: BigInt(Date.now()),
    txHash: '',
  };
}
