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

export function redeemAsset(asset: TokenizedAsset): TokenizedAsset {
  return {
    ...asset,
    status: 'redeemed',
  };
}

export function getActiveAssets(
  assets: TokenizedAsset[]
): TokenizedAsset[] {
  return assets.filter((a) => a.status === 'active');
}

export function calculateTotalValue(
  assets: TokenizedAsset[]
): bigint {
  return assets.reduce(
    (total, asset) => total + asset.tokenAmount,
    BigInt(0)
  );
}
