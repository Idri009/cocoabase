import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createInsurancePolicy,
  type InsurancePolicy,
} from '@/lib/onchain-insurance-utils';

export function useOnchainInsurance() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [policies, setPolicies] = useState<InsurancePolicy[]>([]);

  const purchasePolicy = async (
    coverage: bigint,
    duration: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    await writeContract({
      address: '0x0000000000000000000000000000000000000000' as Address,
      abi: [],
      functionName: 'purchasePolicy',
      args: [coverage, duration],
    });
  };

  return { policies, purchasePolicy, address };
}
