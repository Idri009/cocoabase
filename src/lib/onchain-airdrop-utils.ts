import { type Address } from 'viem';

export interface Airdrop {
  id: bigint;
  creator: Address;
  token: Address;
  totalAmount: bigint;
  recipients: Map<Address, bigint>;
  merkleRoot: string;
  status: 'pending' | 'active' | 'completed';
  createdAt: bigint;
}

export function createAirdrop(
  creator: Address,
  token: Address,
  totalAmount: bigint,
  merkleRoot: string
): Airdrop {
  return {
    id: BigInt(0),
    creator,
    token,
    totalAmount,
    recipients: new Map(),
    merkleRoot,
    status: 'pending',
    createdAt: BigInt(Date.now()),
  };
}

export function claimAirdrop(
  airdrop: Airdrop,
  recipient: Address,
  amount: bigint,
  proof: string[]
): { airdrop: Airdrop; claimed: boolean } {
  if (airdrop.status !== 'active') {
    return { airdrop, claimed: false };
  }
  const newRecipients = new Map(airdrop.recipients);
  newRecipients.set(recipient, amount);
  return {
    airdrop: {
      ...airdrop,
      recipients: newRecipients,
    },
    claimed: true,
  };
}

export function activateAirdrop(airdrop: Airdrop): Airdrop {
  return { ...airdrop, status: 'active' };
}

