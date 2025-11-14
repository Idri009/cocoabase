import { type Address } from 'viem';

export interface DiseaseRecord {
  id: string;
  recordId: bigint;
  plantationId: bigint;
  diseaseType: string;
  severity: bigint;
  detectionDate: bigint;
  treatment: string;
  tracker: Address;
  resolved: boolean;
}

export function createDiseaseRecord(
  address: Address,
  plantationId: bigint,
  diseaseType: string,
  severity: bigint,
  treatment: string
): DiseaseRecord {
  return {
    id: `${Date.now()}-${Math.random()}`,
    recordId: BigInt(0),
    plantationId,
    diseaseType,
    severity,
    detectionDate: BigInt(Date.now()),
    treatment,
    tracker: address,
    resolved: false,
  };
}
