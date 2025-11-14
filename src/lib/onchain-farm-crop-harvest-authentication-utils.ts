import { type Address } from 'viem';

/**
 * Onchain farm crop harvest authentication utilities
 * Authentication creation on blockchain
 */

export interface HarvestAuthentication {
  id: string;
  harvestId: string;
  authenticatedBy: Address;
  authenticator: string;
  authenticationMethod: string;
  authenticationDate: bigint;
  verified: boolean;
  timestamp: bigint;
}

export function createAuthentication(
  address: Address,
  harvestId: string,
  authenticator: string,
  authenticationMethod: string,
  authenticationDate: bigint
): HarvestAuthentication {
  return {
    id: `${Date.now()}-${Math.random()}`,
    harvestId,
    authenticatedBy: address,
    authenticator,
    authenticationMethod,
    authenticationDate,
    verified: false,
    timestamp: BigInt(Date.now()),
  };
}

