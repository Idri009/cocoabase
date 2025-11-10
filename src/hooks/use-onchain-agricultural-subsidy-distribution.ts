import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createSubsidyApplication,
  approveSubsidy,
  distributeSubsidy,
  rejectSubsidy,
  isEligibleForSubsidy,
  calculateSubsidyAmount,
  type Subsidy,
} from '@/lib/onchain-agricultural-subsidy-distribution-utils';

/**
 * Hook for onchain agricultural subsidy distribution operations
 * Requires Reown wallet connection via useAccount
 */
export function useOnchainAgriculturalSubsidyDistribution() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [subsidies, setSubsidies] = useState<Subsidy[]>([]);
  const [isApplying, setIsApplying] = useState(false);
  const [isApproving, setIsApproving] = useState(false);

  const applyForSubsidy = async (
    subsidyType: Subsidy['subsidyType'],
    amount: bigint,
    eligibilityScore: number
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    if (!isEligibleForSubsidy(eligibilityScore)) {
      throw new Error('Not eligible for subsidy');
    }
    setIsApplying(true);
    try {
      const subsidy = createSubsidyApplication(address, subsidyType, amount, eligibilityScore);
      setSubsidies((prev) => [...prev, subsidy]);
      console.log('Applying for subsidy:', subsidy);
      // Onchain application via smart contract
      await writeContract({
        address: '0x0000000000000000000000000000000000000000' as Address,
        abi: [],
        functionName: 'applyForSubsidy',
        args: [subsidyType, amount, eligibilityScore],
      });
    } finally {
      setIsApplying(false);
    }
  };

  const approveSubsidyApplication = async (subsidyId: bigint): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    setIsApproving(true);
    try {
      const subsidy = subsidies.find((s) => s.id === subsidyId);
      if (!subsidy) throw new Error('Subsidy not found');
      const approved = approveSubsidy(subsidy);
      setSubsidies((prev) =>
        prev.map((s) => (s.id === subsidyId ? approved : s))
      );
      console.log('Approving subsidy:', { subsidyId });
      // Onchain approval via smart contract
      await writeContract({
        address: '0x0000000000000000000000000000000000000000' as Address,
        abi: [],
        functionName: 'approveSubsidy',
        args: [subsidyId],
      });
    } finally {
      setIsApproving(false);
    }
  };

  const distributeSubsidyPayment = async (subsidyId: bigint): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    try {
      const subsidy = subsidies.find((s) => s.id === subsidyId);
      if (!subsidy) throw new Error('Subsidy not found');
      const distributed = distributeSubsidy(subsidy);
      setSubsidies((prev) =>
        prev.map((s) => (s.id === subsidyId ? distributed : s))
      );
      console.log('Distributing subsidy:', { subsidyId });
      // Onchain distribution via smart contract
      await writeContract({
        address: '0x0000000000000000000000000000000000000000' as Address,
        abi: [],
        functionName: 'distributeSubsidy',
        args: [subsidyId],
      });
    } finally {
      // Distribution complete
    }
  };

  return {
    subsidies,
    applyForSubsidy,
    approveSubsidyApplication,
    distributeSubsidyPayment,
    rejectSubsidy,
    isEligibleForSubsidy,
    calculateSubsidyAmount,
    isApplying,
    isApproving,
    address,
  };
}

