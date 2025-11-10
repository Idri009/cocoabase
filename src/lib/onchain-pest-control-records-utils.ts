import { type Address } from 'viem';

export interface PestControlRecord {
  id: bigint;
  owner: Address;
  plantationId: bigint;
  pestType: string;
  treatment: string;
  treatmentDate: bigint;
  txHash: string;
}

export function recordPestControl(
  owner: Address,
  plantationId: bigint,
  pestType: string,
  treatment: string
): PestControlRecord {
  return {
    id: BigInt(Date.now()),
    owner,
    plantationId,
    pestType,
    treatment,
    treatmentDate: BigInt(Date.now()),
    txHash: '',
  };
}

export function getPestRecordsByType(
  records: PestControlRecord[],
  pestType: string
): PestControlRecord[] {
  return records.filter((r) => r.pestType === pestType);
}

export function getRecentTreatments(
  records: PestControlRecord[],
  days: number
): PestControlRecord[] {
  const cutoff = BigInt(Date.now() - days * 24 * 60 * 60 * 1000);
  return records.filter((r) => r.treatmentDate >= cutoff);
}
