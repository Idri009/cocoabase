import { type Address } from 'viem';

/**
 * Onchain crowdfunding utilities
 * Decentralized crowdfunding for agricultural projects
 */

export interface CrowdfundingCampaign {
  id: bigint;
  creator: Address;
  title: string;
  description: string;
  goal: bigint;
  raised: bigint;
  token: Address;
  status: 'active' | 'funded' | 'cancelled' | 'failed';
  startTime: bigint;
  endTime: bigint;
  contributors: Map<Address, bigint>;
  minContribution?: bigint;
  maxContribution?: bigint;
}

export function createCampaign(
  creator: Address,
  title: string,
  description: string,
  goal: bigint,
  token: Address,
  duration: bigint,
  minContribution?: bigint,
  maxContribution?: bigint
): CrowdfundingCampaign {
  const now = BigInt(Date.now());
  return {
    id: BigInt(0),
    creator,
    title,
    description,
    goal,
    raised: BigInt(0),
    token,
    status: 'active',
    startTime: now,
    endTime: now + duration,
    contributors: new Map(),
    minContribution,
    maxContribution,
  };
}

export function contribute(
  campaign: CrowdfundingCampaign,
  contributor: Address,
  amount: bigint,
  currentTime: bigint
): CrowdfundingCampaign | null {
  if (campaign.status !== 'active') return null;
  if (currentTime >= campaign.endTime) return null;
  if (campaign.minContribution && amount < campaign.minContribution) return null;
  if (campaign.maxContribution && amount > campaign.maxContribution) return null;
  if (campaign.raised + amount > campaign.goal) return null;

  const newContributors = new Map(campaign.contributors);
  const existing = newContributors.get(contributor) || BigInt(0);
  newContributors.set(contributor, existing + amount);

  const newRaised = campaign.raised + amount;
  const newStatus =
    newRaised >= campaign.goal ? 'funded' : campaign.status;

  return {
    ...campaign,
    raised: newRaised,
    contributors: newContributors,
    status: newStatus,
  };
}

export function isCampaignActive(
  campaign: CrowdfundingCampaign,
  currentTime: bigint
): boolean {
  return (
    campaign.status === 'active' &&
    currentTime < campaign.endTime &&
    currentTime >= campaign.startTime
  );
}

export function finalizeCampaign(
  campaign: CrowdfundingCampaign,
  currentTime: bigint
): CrowdfundingCampaign | null {
  if (campaign.status !== 'active') return null;
  if (currentTime < campaign.endTime) return null;

  const newStatus =
    campaign.raised >= campaign.goal ? 'funded' : 'failed';

  return {
    ...campaign,
    status: newStatus,
  };
}

export function calculateContributionPercentage(
  campaign: CrowdfundingCampaign
): number {
  if (campaign.goal === BigInt(0)) return 0;
  return Number((campaign.raised * BigInt(10000)) / campaign.goal) / 100;
}

