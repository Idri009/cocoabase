import { type Address } from 'viem';

/**
 * Onchain farm crop photography utilities
 * Photo record creation and verification
 */

export interface PhotoRecord {
  id: string;
  plantationId: string;
  recordedBy: Address;
  photoHash: string;
  photoDate: bigint;
  description: string;
  verified: boolean;
  timestamp: bigint;
}

export function createPhotoRecord(
  address: Address,
  plantationId: string,
  photoHash: string,
  photoDate: bigint,
  description: string
): PhotoRecord {
  return {
    id: `${Date.now()}-${Math.random()}`,
    plantationId,
    recordedBy: address,
    photoHash,
    photoDate,
    description,
    verified: false,
    timestamp: BigInt(Date.now()),
  };
}

