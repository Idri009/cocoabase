import { type Address } from 'viem';

export interface WasteRecord {
  id: bigint;
  owner: Address;
  plantationId: bigint;
  wasteType: 'organic' | 'plastic' | 'chemical' | 'other';
  quantity: bigint;
  disposalMethod: string;
  disposalDate: bigint;
  txHash: string;
}

export function recordWaste(
  owner: Address,
  plantationId: bigint,
  wasteType: WasteRecord['wasteType'],
  quantity: bigint,
  disposalMethod: string
): WasteRecord {
  return {
    id: BigInt(Date.now()),
    owner,
    plantationId,
    wasteType,
    quantity,
    disposalMethod,
    disposalDate: BigInt(Date.now()),
    txHash: '',
  };
}
