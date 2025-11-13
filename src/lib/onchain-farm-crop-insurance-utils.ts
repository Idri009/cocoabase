import { type Address } from 'viem';

/**
 * Onchain farm crop insurance utilities
 * Crop insurance policy creation and claims
 */

export interface CropInsurance {
  id: string;
  plantationId: string;
  owner: Address;
  coverageAmount: bigint;
  premium: bigint;
  cropType: string;
  status: 'active' | 'claimed' | 'expired';
  timestamp: bigint;
}

export function createCropInsurance(
  address: Address,
  plantationId: string,
  coverageAmount: bigint,
  premium: bigint,
  cropType: string
): CropInsurance {
  return {
    id: `${Date.now()}-${Math.random()}`,
    plantationId,
    owner: address,
    coverageAmount,
    premium,
    cropType,
    status: 'active',
    timestamp: BigInt(Date.now()),
  };
}

