import { type Address } from 'viem';

export interface PestControlRecord {
  id: bigint;
  owner: Address;
  plantationId: bigint;
  pestType: string;
  treatment: string;
  treatmentDate: bigint;
  txHash: string;
}

export function recordPestControl(
  owner: Address,
  plantationId: bigint,
  pestType: string,
  treatment: string
): PestControlRecord {
  return {
    id: BigInt(Date.now()),
    owner,
    plantationId,
    pestType,
    treatment,
    treatmentDate: BigInt(Date.now()),
    txHash: '',
  };
}
