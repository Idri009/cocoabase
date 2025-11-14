import { type Address } from 'viem';

export interface Proposal {
  id: string;
  proposalId: bigint;
  description: string;
  proposer: Address;
  startDate: bigint;
  endDate: bigint;
  yesVotes: bigint;
  noVotes: bigint;
  executed: boolean;
}

export function createProposal(
  address: Address,
  description: string,
  votingDuration: bigint
): Proposal {
  return {
    id: `${Date.now()}-${Math.random()}`,
    proposalId: BigInt(0),
    description,
    proposer: address,
    startDate: BigInt(Date.now()),
    endDate: BigInt(Date.now()) + votingDuration,
    yesVotes: BigInt(0),
    noVotes: BigInt(0),
    executed: false,
  };
}
