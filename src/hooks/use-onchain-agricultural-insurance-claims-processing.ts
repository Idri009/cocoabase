import { useState } from 'react';
import { useAccount } from 'wagmi';
import {
  createClaim,
  type InsuranceClaim,
} from '@/lib/onchain-agricultural-insurance-claims-processing-utils';

export function useOnchainAgriculturalInsuranceClaimsProcessing() {
  const { address } = useAccount();
  const [claims, setClaims] = useState<InsuranceClaim[]>([]);

  const create = async (
    claimType: string,
    amount: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    const claim = createClaim(address, claimType, amount);
    setClaims([...claims, claim]);
  };

  return { claims, create, address };
}
