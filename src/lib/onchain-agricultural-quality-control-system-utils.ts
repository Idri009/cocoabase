import { type Address } from 'viem';

export interface QualityCheck {
  id: bigint;
  inspector: Address;
  productId: bigint;
  qualityScore: number;
  checkDate: bigint;
  passed: boolean;
  txHash: string;
}

export function performQualityCheck(
  inspector: Address,
  productId: bigint,
  qualityScore: number
): QualityCheck {
  return {
    id: BigInt(Date.now()),
    inspector,
    productId,
    qualityScore,
    checkDate: BigInt(Date.now()),
    passed: qualityScore >= 70,
    txHash: '',
  };
}

export function getPassedChecks(
  checks: QualityCheck[]
): QualityCheck[] {
  return checks.filter((c) => c.passed);
}

export function getFailedChecks(
  checks: QualityCheck[]
): QualityCheck[] {
  return checks.filter((c) => !c.passed);
}

export function getAverageQualityScore(
  checks: QualityCheck[]
): number {
  if (checks.length === 0) return 0;
  const total = checks.reduce((sum, c) => sum + c.qualityScore, 0);
  return total / checks.length;
}
