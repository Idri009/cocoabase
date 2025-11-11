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

export function getImpactsByType(
  measurements: ImpactMeasurement[],
  impactType: ImpactMeasurement['impactType']
): ImpactMeasurement[] {
  return measurements.filter((m) => m.impactType === impactType);
}

export function getTotalImpact(
  measurements: ImpactMeasurement[],
  metric: string
): bigint {
  return measurements
    .filter((m) => m.metric === metric)
    .reduce((total, m) => total + m.value, BigInt(0));
}

export function getRecentMeasurements(
  measurements: ImpactMeasurement[],
  days: number
): ImpactMeasurement[] {
  const cutoff = BigInt(Date.now() - days * 24 * 60 * 60 * 1000);
  return measurements.filter((m) => m.measurementDate >= cutoff);
}
