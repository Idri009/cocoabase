import { type Address } from 'viem';

export interface FertilizerRecord {
  id: bigint;
  owner: Address;
  plantationId: bigint;
  fertilizerType: string;
  quantity: bigint;
  applicationDate: bigint;
  txHash: string;
}

export function recordFertilizer(
  owner: Address,
  plantationId: bigint,
  fertilizerType: string,
  quantity: bigint
): FertilizerRecord {
  return {
    id: BigInt(Date.now()),
    owner,
    plantationId,
    fertilizerType,
    quantity,
    applicationDate: BigInt(Date.now()),
    txHash: '',
  };
}

export function getTotalFertilizerUsed(
  records: FertilizerRecord[],
  plantationId: bigint
): bigint {
  return records
    .filter((r) => r.plantationId === plantationId)
    .reduce((total, record) => total + record.quantity, BigInt(0));
}

export function getFertilizerByType(
  records: FertilizerRecord[],
  type: string
): FertilizerRecord[] {
  return records.filter((r) => r.fertilizerType === type);
}
