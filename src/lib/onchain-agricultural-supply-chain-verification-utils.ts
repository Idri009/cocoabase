import { type Address } from 'viem';

export interface VerificationRecord {
  id: bigint;
  verifier: Address;
  productId: bigint;
  verified: boolean;
  timestamp: bigint;
}

export function createVerification(
  verifier: Address,
  productId: bigint,
  verified: boolean
): VerificationRecord {
  return {
    id: BigInt(Date.now()),
    verifier,
    productId,
    verified,
    timestamp: BigInt(Date.now()),
  };
}

export function getVerifiedProducts(
  records: VerificationRecord[]
): VerificationRecord[] {
  return records.filter((r) => r.verified);
}

export function getVerificationsByProduct(
  records: VerificationRecord[],
  productId: bigint
): VerificationRecord[] {
  return records.filter((r) => r.productId === productId);
}
