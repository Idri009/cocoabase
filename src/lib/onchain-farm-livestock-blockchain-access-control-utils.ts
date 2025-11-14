import { type Address } from 'viem';

/**
 * Onchain farm livestock blockchain access control utilities
 * Access control creation on blockchain
 */

export interface AccessControl {
  id: string;
  animalId: string;
  grantedBy: Address;
  user: Address;
  role: string;
  grantDate: bigint;
  revoked: boolean;
  timestamp: bigint;
}

export function createAccessControl(
  address: Address,
  animalId: string,
  user: Address,
  role: string,
  grantDate: bigint
): AccessControl {
  return {
    id: `${Date.now()}-${Math.random()}`,
    animalId,
    grantedBy: address,
    user,
    role,
    grantDate,
    revoked: false,
    timestamp: BigInt(Date.now()),
  };
}

