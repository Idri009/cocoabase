import { type Address } from 'viem';

export interface EnergyConsumption {
  id: bigint;
  owner: Address;
  plantationId: bigint;
  energyType: 'electricity' | 'fuel' | 'solar' | 'wind';
  consumption: bigint;
  unit: string;
  consumptionDate: bigint;
  txHash: string;
}

export function recordEnergyConsumption(
  owner: Address,
  plantationId: bigint,
  energyType: EnergyConsumption['energyType'],
  consumption: bigint,
  unit: string
): EnergyConsumption {
  return {
    id: BigInt(Date.now()),
    owner,
    plantationId,
    energyType,
    consumption,
    unit,
    consumptionDate: BigInt(Date.now()),
    txHash: '',
  };
}

export function getConsumptionByType(
  records: EnergyConsumption[],
  energyType: EnergyConsumption['energyType']
): EnergyConsumption[] {
  return records.filter((r) => r.energyType === energyType);
}

export function getTotalConsumption(
  records: EnergyConsumption[],
  plantationId: bigint
): bigint {
  return records
    .filter((r) => r.plantationId === plantationId)
    .reduce((total, r) => total + r.consumption, BigInt(0));
}

export function getRecentConsumption(
  records: EnergyConsumption[],
  days: number
): EnergyConsumption[] {
  const cutoff = BigInt(Date.now() - days * 24 * 60 * 60 * 1000);
  return records.filter((r) => r.consumptionDate >= cutoff);
}
