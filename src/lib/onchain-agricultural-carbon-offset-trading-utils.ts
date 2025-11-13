import { type Address } from 'viem';

export interface CarbonOffset {
  id: bigint;
  owner: Address;
  amount: bigint;
  price: bigint;
  timestamp: bigint;
}

export function createCarbonOffset(
  owner: Address,
  amount: bigint,
  price: bigint
): CarbonOffset {
  return {
    id: BigInt(Date.now()),
    owner,
    amount,
    price,
    timestamp: BigInt(Date.now()),
  };
}
