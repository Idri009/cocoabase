import { type Address } from 'viem';

export interface CommodityFuture {
  id: bigint;
  trader: Address;
  commodity: string;
  quantity: bigint;
  price: bigint;
  expiryDate: bigint;
  status: 'open' | 'settled' | 'expired';
  txHash: string;
}

export function createFuture(
  trader: Address,
  commodity: string,
  quantity: bigint,
  price: bigint,
  expiryDate: bigint
): CommodityFuture {
  return {
    id: BigInt(Date.now()),
    trader,
    commodity,
    quantity,
    price,
    expiryDate,
    status: 'open',
    txHash: '',
  };
}
