import { type Address } from 'viem';

/**
 * Onchain farm equipment sharing utilities
 * Equipment sharing agreements and management
 */

export interface EquipmentSharing {
  id: string;
  equipmentId: string;
  owner: Address;
  borrower: Address;
  duration: number;
  fee: bigint;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  startDate: bigint;
  endDate: bigint;
}

export function createSharing(
  owner: Address,
  equipmentId: string,
  borrower: Address,
  duration: number,
  fee: bigint
): EquipmentSharing {
  const startDate = BigInt(Date.now());
  const endDate = BigInt(Date.now() + duration * 24 * 60 * 60 * 1000);
  return {
    id: `${Date.now()}-${Math.random()}`,
    equipmentId,
    owner,
    borrower,
    duration,
    fee,
    status: 'pending',
    startDate,
    endDate,
  };
}

