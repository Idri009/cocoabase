import { type Address } from 'viem';

export interface BreedingRecord {
  id: string;
  recordId: bigint;
  sireId: bigint;
  damId: bigint;
  breedingDate: bigint;
  breeder: Address;
  successful: boolean;
  offspringId?: bigint;
}

export function createBreedingRecord(
  address: Address,
  sireId: bigint,
  damId: bigint
): BreedingRecord {
  return {
    id: `${Date.now()}-${Math.random()}`,
    recordId: BigInt(0),
    sireId,
    damId,
    breedingDate: BigInt(Date.now()),
    breeder: address,
    successful: false,
  };
}
