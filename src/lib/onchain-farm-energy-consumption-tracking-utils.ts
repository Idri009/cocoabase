import { type Address } from 'viem';

export interface EnergyConsumption {
  id: bigint;
  recorder: Address;
  source: string;
  amount: bigint;
  timestamp: bigint;
}

export function createEnergyConsumption(
  recorder: Address,
  source: string,
  amount: bigint
): EnergyConsumption {
  return {
    id: BigInt(Date.now()),
    recorder,
    source,
    amount,
    timestamp: BigInt(Date.now()),
  };
}

export function getTotalConsumption(
  records: EnergyConsumption[]
): bigint {
  return records.reduce((total, r) => total + r.amount, BigInt(0));
}

export function getConsumptionBySource(
  records: EnergyConsumption[],
  source: string
): EnergyConsumption[] {
  return records.filter((r) => r.source === source);
}
