import { type Address } from 'viem';

/**
 * Onchain farm livestock blockchain permission utilities
 * Permission creation on blockchain
 */

export interface Permission {
  id: string;
  animalId: string;
  grantedBy: Address;
  grantee: Address;
  permissionType: string;
  grantDate: bigint;
  expiryDate: bigint;
  revoked: boolean;
  timestamp: bigint;
}

export function createPermission(
  address: Address,
  animalId: string,
  grantee: Address,
  permissionType: string,
  grantDate: bigint,
  expiryDate: bigint
): Permission {
  return {
    id: `${Date.now()}-${Math.random()}`,
    animalId,
    grantedBy: address,
    grantee,
    permissionType,
    grantDate,
    expiryDate,
    revoked: false,
    timestamp: BigInt(Date.now()),
  };
}

