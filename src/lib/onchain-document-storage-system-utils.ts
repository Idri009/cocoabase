import { type Address } from 'viem';

export interface Document {
  id: bigint;
  owner: Address;
  documentType: string;
  documentHash: string;
  storedDate: bigint;
  txHash: string;
}

export function storeDocument(
  owner: Address,
  documentType: string,
  documentHash: string
): Document {
  return {
    id: BigInt(Date.now()),
    owner,
    documentType,
    documentHash,
    storedDate: BigInt(Date.now()),
    txHash: '',
  };
}
