import { useState } from 'react';
import { useAccount } from 'wagmi';
import {
  submitSubsidyClaim,
  type FarmSubsidyClaim,
} from '@/lib/onchain-farm-subsidy-claims-utils';

export function useOnchainFarmSubsidyClaims() {
  const { address } = useAccount();
  const [claims, setClaims] = useState<FarmSubsidyClaim[]>([]);

  const submitClaim = async (
    plantationId: bigint,
    subsidyType: string,
    amount: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected');
    const claim = submitSubsidyClaim(address, plantationId, subsidyType, amount);
    setClaims([...claims, claim]);
  };

  return { claims, submitClaim, address };
}
