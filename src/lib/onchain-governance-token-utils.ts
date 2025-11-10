import { type Address } from 'viem';

export interface GovernanceToken {
  id: bigint;
  token: Address;
  totalSupply: bigint;
  votingPower: Map<Address, bigint>;
  proposals: bigint[];
}

export function createGovernanceToken(
  token: Address,
  totalSupply: bigint
): GovernanceToken {
  return {
    id: BigInt(0),
    token,
    totalSupply,
    votingPower: new Map(),
    proposals: [],
  };
}

export function assignVotingPower(
  governance: GovernanceToken,
  holder: Address,
  amount: bigint
): GovernanceToken {
  const newVotingPower = new Map(governance.votingPower);
  const existing = newVotingPower.get(holder) || BigInt(0);
  newVotingPower.set(holder, existing + amount);
  return {
    ...governance,
    votingPower: newVotingPower,
  };
}

export function getVotingPower(
  governance: GovernanceToken,
  holder: Address
): bigint {
  return governance.votingPower.get(holder) || BigInt(0);
}

export function calculateVotingPercentage(
  governance: GovernanceToken,
  holder: Address
): number {
  if (governance.totalSupply === BigInt(0)) return 0;
  const power = getVotingPower(governance, holder);
  return Number((power * BigInt(10000)) / governance.totalSupply) / 100;
}
