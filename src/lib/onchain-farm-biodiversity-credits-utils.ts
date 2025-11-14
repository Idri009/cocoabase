import { type Address } from 'viem';

export interface BiodiversityCredit {
  id: string;
  plantationId: bigint;
  creditAmount: bigint;
  issueDate: bigint;
  biodiversityType: string;
  issuer: Address;
  verified: boolean;
  value: bigint;
}

export function createBiodiversityCredit(
  address: Address,
  plantationId: bigint,
  creditAmount: bigint,
  biodiversityType: string
): BiodiversityCredit {
  return {
    id: `${Date.now()}-${Math.random()}`,
    plantationId,
    creditAmount,
    issueDate: BigInt(Date.now()),
    biodiversityType,
    issuer: address,
    verified: false,
    value: BigInt(0),
  };
}
