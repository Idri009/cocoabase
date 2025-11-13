import { type Address } from 'viem';

export interface WasteRecord {
  id: string;
  recordId: bigint;
  farmOwner: Address;
  wasteType: string;
  amount: bigint;
  disposalMethod: string;
  date: bigint;
  recycled: boolean;
  recyclingValue: bigint;
}

export function createWasteRecord(
  farmOwner: Address,
  recordId: bigint,
  wasteType: string,
  amount: bigint,
  disposalMethod: string
): WasteRecord {
  return {
    id: `${Date.now()}-${Math.random()}`,
    recordId,
    farmOwner,
    wasteType,
    amount,
    disposalMethod,
    date: BigInt(Date.now()),
    recycled: false,
    recyclingValue: BigInt(0),
  };
}
