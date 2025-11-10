import { type Address } from 'viem';

/**
 * Onchain identity utilities
 * Decentralized identity management for farmers
 */

export interface DecentralizedIdentity {
  address: Address;
  did: string;
  credentials: IdentityCredential[];
  verified: boolean;
  reputation: bigint;
}

export interface IdentityCredential {
  issuer: Address;
  credentialType: string;
  data: string;
  issuedAt: bigint;
  expiresAt?: bigint;
}

export function createIdentity(address: Address): DecentralizedIdentity {
  return {
    address,
    did: `did:ethr:${address}`,
    credentials: [],
    verified: false,
    reputation: BigInt(0),
  };
}

export function issueCredential(
  identity: DecentralizedIdentity,
  issuer: Address,
  credentialType: string,
  data: string,
  expiresAt?: bigint
): DecentralizedIdentity {
  const now = BigInt(Date.now());
  const credential: IdentityCredential = {
    issuer,
    credentialType,
    data,
    issuedAt: now,
    expiresAt,
  };
  return {
    ...identity,
    credentials: [...identity.credentials, credential],
  };
}
