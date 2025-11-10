import { type Address } from 'viem';

export interface QualityAssurance {
  id: bigint;
  owner: Address;
  plantationId: bigint;
  harvestId: bigint;
  qualityScore: number;
  inspectionDate: bigint;
  inspector: Address;
  txHash: string;
}

export function recordQualityAssurance(
  owner: Address,
  plantationId: bigint,
  harvestId: bigint,
  qualityScore: number,
  inspector: Address
): QualityAssurance {
  return {
    id: BigInt(Date.now()),
    owner,
    plantationId,
    harvestId,
    qualityScore,
    inspectionDate: BigInt(Date.now()),
    inspector,
    txHash: '',
  };
}
