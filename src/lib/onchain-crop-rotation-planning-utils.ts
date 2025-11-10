import { type Address } from 'viem';

export interface CropRotationPlan {
  id: bigint;
  owner: Address;
  plantationId: bigint;
  currentCrop: string;
  nextCrop: string;
  rotationDate: bigint;
  status: 'planned' | 'active' | 'completed';
  txHash: string;
}

export function createRotationPlan(
  owner: Address,
  plantationId: bigint,
  currentCrop: string,
  nextCrop: string,
  rotationDate: bigint
): CropRotationPlan {
  return {
    id: BigInt(Date.now()),
    owner,
    plantationId,
    currentCrop,
    nextCrop,
    rotationDate,
    status: 'planned',
    txHash: '',
  };
}
