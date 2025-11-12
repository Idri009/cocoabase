import { type Address } from 'viem';

export interface TokenizedAsset {
  id: bigint;
  assetType: 'land' | 'equipment' | 'crop' | 'livestock';
  owner: Address;
  tokenAmount: bigint;
  status: 'active' | 'redeemed';
}

export function createTokenizedAsset(
  assetType: 'land' | 'equipment' | 'crop' | 'livestock',
  owner: Address,
  tokenAmount: bigint
): TokenizedAsset {
  return {
    id: BigInt(0),
    assetType,
    owner,
    tokenAmount,
    status: 'active',
  };
}
