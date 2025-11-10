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

export function approveSubsidy(
  claim: FarmSubsidyClaim,
  approver: Address
): FarmSubsidyClaim {
  return {
    ...claim,
    status: 'approved',
  };
}

export function getTotalSubsidyAmount(
  claims: FarmSubsidyClaim[]
): bigint {
  return claims
    .filter((c) => c.status === 'approved')
    .reduce((total, claim) => total + claim.amount, BigInt(0));
}
