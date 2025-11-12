import { type Address } from 'viem';

export interface EnergyRecord {
  id: bigint;
  recorder: Address;
  source: 'solar' | 'wind' | 'grid' | 'biomass';
  amount: bigint;
  timestamp: bigint;
}

export function createEnergyRecord(
  recorder: Address,
  source: 'solar' | 'wind' | 'grid' | 'biomass',
  amount: bigint
): EnergyRecord {
  return {
    id: BigInt(0),
    recorder,
    source,
    amount,
    timestamp: BigInt(Date.now()),
  };
}

export function getEnergyBySource(
  records: EnergyRecord[],
  source: 'solar' | 'wind' | 'grid' | 'biomass'
): EnergyRecord[] {
  return records.filter((r) => r.source === source);
}

export function calculateTotalEnergy(records: EnergyRecord[]): bigint {
  return records.reduce((total, r) => total + r.amount, BigInt(0));
}

export function getRecentEnergy(
  records: EnergyRecord[],
  days: number
): EnergyRecord[] {
  const cutoff = BigInt(Date.now()) - BigInt(days * 24 * 60 * 60 * 1000);
  return records.filter((r) => r.timestamp >= cutoff);
}
