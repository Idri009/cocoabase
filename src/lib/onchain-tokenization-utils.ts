import { type Address } from 'viem';

export interface TokenizedAsset {
  id: bigint;
  owner: Address;
  assetType: string;
  assetId: string;
  tokenContract: Address;
  totalSupply: bigint;
  pricePerToken: bigint;
  status: 'active' | 'redeemed' | 'cancelled';
  createdAt: bigint;
  metadata: string;
}

export function tokenizeAsset(
  owner: Address,
  assetType: string,
  assetId: string,
  tokenContract: Address,
  totalSupply: bigint,
  pricePerToken: bigint,
  metadata: string
): TokenizedAsset {
  const now = BigInt(Date.now());
  return {
    id: BigInt(0),
    owner,
    assetType,
    assetId,
    tokenContract,
    totalSupply,
    pricePerToken,
    status: 'active',
    createdAt: now,
    metadata,
  };
}

export function purchaseTokens(
  tokenized: TokenizedAsset,
  buyer: Address,
  amount: bigint
): { tokenized: TokenizedAsset; tokens: bigint } | null {
  if (tokenized.status !== 'active') return null;
  if (amount > tokenized.totalSupply) return null;

  return {
    tokenized: {
      ...tokenized,
      totalSupply: tokenized.totalSupply - amount,
    },
    tokens: amount,
  };
}

export function redeemAsset(
  tokenized: TokenizedAsset,
  redeemer: Address,
  tokensRequired: bigint
): TokenizedAsset | null {
  if (tokenized.status !== 'active') return null;
  if (tokensRequired < tokenized.totalSupply / BigInt(2)) return null;

  return {
    ...tokenized,
    status: 'redeemed',
  };
}

export function calculateOwnership(
  tokens: bigint,
  totalSupply: bigint
): number {
  if (totalSupply === BigInt(0)) return 0;
  return Number((tokens * BigInt(10000)) / totalSupply) / 100;
}

export function calculateValuation(
  tokenized: TokenizedAsset
): bigint {
  return tokenized.totalSupply * tokenized.pricePerToken;
}

