import { useState } from 'react';
import { useAccount } from 'wagmi';
import type { Address } from 'viem';
import {
  createIdentity,
  addCredential,
  verifyIdentity,
  updateReputation,
  type DecentralizedIdentity,
  type Credential,
} from '@/lib/onchain-identity-utils';

export function useOnchainIdentity() {
  const { address } = useAccount();
  const [identity, setIdentity] = useState<DecentralizedIdentity | null>(null);

  const initializeIdentity = () => {
    if (!address) throw new Error('Wallet not connected');
    const newIdentity = createIdentity(address);
    setIdentity(newIdentity);
    console.log('Initializing identity:', newIdentity);
  };

  const addIdentityCredential = (credential: Credential) => {
    if (!identity) throw new Error('Identity not initialized');
    const updated = addCredential(identity, credential);
    setIdentity(updated);
    console.log('Adding credential:', credential);
  };

  const verifyIdentityStatus = () => {
    if (!identity) throw new Error('Identity not initialized');
    const updated = verifyIdentity(identity);
    setIdentity(updated);
    console.log('Verifying identity:', updated);
  };

  const updateIdentityReputation = (score: number) => {
    if (!identity) throw new Error('Identity not initialized');
    const updated = updateReputation(identity, score);
    setIdentity(updated);
    console.log('Updating reputation:', updated);
  };

  return {
    identity,
    initializeIdentity,
    addIdentityCredential,
    verifyIdentityStatus,
    updateIdentityReputation,
    address,
  };
}
