import { type Address } from 'viem';

export interface MarketAccess {
  id: bigint;
  farmer: Address;
  market: string;
  accessLevel: 'full' | 'limited' | 'restricted';
  timestamp: bigint;
}

export function createMarketAccess(
  farmer: Address,
  market: string,
  accessLevel: 'full' | 'limited' | 'restricted'
): MarketAccess {
  return {
    id: BigInt(Date.now()),
    farmer,
    market,
    accessLevel,
    timestamp: BigInt(Date.now()),
  };
}
