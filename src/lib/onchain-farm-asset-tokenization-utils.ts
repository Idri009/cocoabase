import { type Address } from 'viem';

export interface Asset {
  id: string;
  assetId: bigint;
  assetType: string;
  value: bigint;
  metadata: string;
  tokenizationDate: bigint;
  owner: Address;
}

export function createAsset(
  owner: Address,
  assetId: bigint,
  assetType: string,
  value: bigint,
  metadata: string
): Asset {
  return {
    id: `${Date.now()}-${Math.random()}`,
    assetId,
    assetType,
    value,
    metadata,
    tokenizationDate: BigInt(Date.now()),
    owner,
  };
}
