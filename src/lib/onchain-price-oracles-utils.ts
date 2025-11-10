import { type Address } from 'viem';

export interface PriceOracle {
  id: bigint;
  provider: Address;
  commodity: string;
  price: bigint;
  timestamp: bigint;
  txHash: string;
}

export function updatePrice(
  provider: Address,
  commodity: string,
  price: bigint
): PriceOracle {
  return {
    id: BigInt(Date.now()),
    provider,
    commodity,
    price,
    timestamp: BigInt(Date.now()),
    txHash: '',
  };
}
