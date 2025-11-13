import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createSubsidyApplication,
  type SubsidyApplication,
} from '@/lib/onchain-farm-subsidy-application-utils';

/**
 * Hook for onchain farm subsidy application
 * Uses Reown wallet for all transactions
 */
export function useOnchainFarmSubsidyApplication() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [applications, setApplications] = useState<SubsidyApplication[]>([]);

  const applyForSubsidy = async (
    plantationId: string,
    subsidyType: string,
    requestedAmount: bigint,
    justification: string
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    const application = createSubsidyApplication(address, plantationId, subsidyType, requestedAmount, justification);
    setApplications([...applications, application]);
  };

  const approveApplication = async (
    contractAddress: Address,
    applicationId: string
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    await writeContract({
      address: contractAddress,
      abi: [],
      functionName: 'approveApplication',
      args: [applicationId],
    });
  };

  return { applications, applyForSubsidy, approveApplication, address };
}

