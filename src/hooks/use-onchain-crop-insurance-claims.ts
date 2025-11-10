import { useState } from 'react';
import { useAccount } from 'wagmi';
import type { Address } from 'viem';
import {
  submitClaim,
  approveClaim,
  type InsuranceClaim,
} from '@/lib/onchain-crop-insurance-claims-utils';

export function useOnchainCropInsuranceClaims() {
  const { address } = useAccount();
  const [claims, setClaims] = useState<InsuranceClaim[]>([]);

  const submitInsuranceClaim = async (
    plantationId: bigint,
    claimType: InsuranceClaim['claimType'],
    amount: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected');
    const claim = submitClaim(address, plantationId, claimType, amount);
    setClaims([...claims, claim]);
  };

  return {
    claims,
    submitInsuranceClaim,
    address,
  };
}
