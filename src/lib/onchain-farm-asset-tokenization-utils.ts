import { type Address } from 'viem';

export interface TokenizedAsset {
  id: bigint;
  owner: Address;
  assetType: 'land' | 'equipment' | 'crop' | 'livestock';
  tokenAmount: bigint;
  tokenizedDate: bigint;
  status: 'active' | 'redeemed' | 'burned';
  txHash: string;
}

export function tokenizeAsset(
  owner: Address,
  assetType: TokenizedAsset['assetType'],
  tokenAmount: bigint
): TokenizedAsset {
  return {
    id: BigInt(Date.now()),
    owner,
    assetType,
    tokenAmount,
    tokenizedDate: BigInt(Date.now()),
    status: 'active',
    txHash: '',
  };
}
