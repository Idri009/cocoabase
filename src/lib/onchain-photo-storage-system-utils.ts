import { type Address } from 'viem';

export interface Photo {
  id: bigint;
  owner: Address;
  plantationId: bigint;
  photoHash: string;
  uploadedDate: bigint;
  txHash: string;
}

export function storePhoto(
  owner: Address,
  plantationId: bigint,
  photoHash: string
): Photo {
  return {
    id: BigInt(Date.now()),
    owner,
    plantationId,
    photoHash,
    uploadedDate: BigInt(Date.now()),
    txHash: '',
  };
}
