import { type Address } from 'viem';

export interface QualityAssurance {
  id: bigint;
  owner: Address;
  plantationId: bigint;
  harvestId: bigint;
  qualityScore: number;
  inspectionDate: bigint;
  inspector: Address;
  txHash: string;
}

export function recordQualityAssurance(
  owner: Address,
  plantationId: bigint,
  harvestId: bigint,
  qualityScore: number,
  inspector: Address
): QualityAssurance {
  return {
    id: BigInt(Date.now()),
    owner,
    plantationId,
    harvestId,
    qualityScore,
    inspectionDate: BigInt(Date.now()),
    inspector,
    txHash: '',
  };
}

export function getQualityByPlantation(
  records: QualityAssurance[],
  plantationId: bigint
): QualityAssurance[] {
  return records.filter((r) => r.plantationId === plantationId);
}

export function calculateAverageQuality(
  records: QualityAssurance[]
): number {
  if (records.length === 0) return 0;
  const total = records.reduce((sum, r) => sum + r.qualityScore, 0);
  return total / records.length;
}

export function getHighQualityHarvests(
  records: QualityAssurance[],
  minScore: number
): QualityAssurance[] {
  return records.filter((r) => r.qualityScore >= minScore);
}
