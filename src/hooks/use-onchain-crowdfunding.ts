import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createCampaign,
  contribute,
  isCampaignActive,
  finalizeCampaign,
  calculateContributionPercentage,
  type CrowdfundingCampaign,
} from '@/lib/onchain-crowdfunding-utils';

/**
 * Hook for onchain crowdfunding operations
 */
export function useOnchainCrowdfunding() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [campaigns, setCampaigns] = useState<CrowdfundingCampaign[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [isContributing, setIsContributing] = useState(false);

  const createNewCampaign = async (
    title: string,
    description: string,
    goal: bigint,
    token: Address,
    duration: bigint,
    minContribution?: bigint,
    maxContribution?: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected');
    setIsCreating(true);
    try {
      const campaign = createCampaign(
        address,
        title,
        description,
        goal,
        token,
        duration,
        minContribution,
        maxContribution
      );
      console.log('Creating campaign:', campaign);
      // Onchain campaign creation via smart contract
    } finally {
      setIsCreating(false);
    }
  };

  const contributeToCampaign = async (
    campaignId: bigint,
    amount: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected');
    setIsContributing(true);
    try {
      const currentTime = BigInt(Date.now());
      const campaign = campaigns.find((c) => c.id === campaignId);
      if (!campaign) throw new Error('Campaign not found');
      const updated = contribute(campaign, address, amount, currentTime);
      if (updated) {
        console.log('Contributing to campaign:', { campaignId, amount, address });
        // Onchain contribution via smart contract
      }
    } finally {
      setIsContributing(false);
    }
  };

  return {
    campaigns,
    createNewCampaign,
    contributeToCampaign,
    isCreating,
    isContributing,
    isCampaignActive,
    finalizeCampaign,
    calculateContributionPercentage,
    address,
  };
}

