import { type Address } from 'viem';

export interface WaterRight {
  id: string;
  rightId: bigint;
  waterAmount: bigint;
  price: bigint;
  seller: Address;
  buyer?: Address;
  listingDate: bigint;
  sold: boolean;
}

export function createWaterRight(
  address: Address,
  waterAmount: bigint,
  price: bigint
): WaterRight {
  return {
    id: `${Date.now()}-${Math.random()}`,
    rightId: BigInt(0),
    waterAmount,
    price,
    seller: address,
    listingDate: BigInt(Date.now()),
    sold: false,
  };
}
