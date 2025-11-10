import { type Address } from 'viem';

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
