import { type Address } from 'viem';

export interface ImpactMeasurement {
  id: bigint;
  owner: Address;
  plantationId: bigint;
  impactType: 'environmental' | 'social' | 'economic';
  metric: string;
  value: bigint;
  measurementDate: bigint;
  txHash: string;
}

export function recordImpact(
  owner: Address,
  plantationId: bigint,
  impactType: ImpactMeasurement['impactType'],
  metric: string,
  value: bigint
): ImpactMeasurement {
  return {
    id: BigInt(Date.now()),
    owner,
    plantationId,
    impactType,
    metric,
    value,
    measurementDate: BigInt(Date.now()),
    txHash: '',
  };
}
