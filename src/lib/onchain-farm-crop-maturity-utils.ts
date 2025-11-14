import { type Address } from 'viem';

export interface MaturityRecord {
  id: string;
  recordId: bigint;
  plantationId: bigint;
  maturityStage: string;
  maturityDate: bigint;
  recorder: Address;
  harvestReady: boolean;
}

export function createMaturityRecord(
  address: Address,
  plantationId: bigint,
  maturityStage: string,
  harvestReady: boolean
): MaturityRecord {
  return {
    id: `${Date.now()}-${Math.random()}`,
    recordId: BigInt(0),
    plantationId,
    maturityStage,
    maturityDate: BigInt(Date.now()),
    recorder: address,
    harvestReady,
  };
}
