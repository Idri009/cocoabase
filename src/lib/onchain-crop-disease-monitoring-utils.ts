import { type Address } from 'viem';

export interface DiseaseRecord {
  id: bigint;
  owner: Address;
  plantationId: bigint;
  diseaseType: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  detectedDate: bigint;
  status: 'active' | 'treated' | 'resolved';
  txHash: string;
}

export function recordDisease(
  owner: Address,
  plantationId: bigint,
  diseaseType: string,
  severity: DiseaseRecord['severity']
): DiseaseRecord {
  return {
    id: BigInt(Date.now()),
    owner,
    plantationId,
    diseaseType,
    severity,
    detectedDate: BigInt(Date.now()),
    status: 'active',
    txHash: '',
  };
}

export function markDiseaseTreated(
  record: DiseaseRecord
): DiseaseRecord {
  return {
    ...record,
    status: 'treated',
  };
}

export function getActiveDiseases(
  records: DiseaseRecord[]
): DiseaseRecord[] {
  return records.filter((r) => r.status === 'active');
}

export function getCriticalDiseases(
  records: DiseaseRecord[]
): DiseaseRecord[] {
  return records.filter((r) => r.severity === 'critical' && r.status === 'active');
}
