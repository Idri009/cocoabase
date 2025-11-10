import { type Address } from 'viem';

export interface CropFuture {
  id: bigint;
  owner: Address;
  cropType: string;
  quantity: bigint;
  price: bigint;
  deliveryDate: bigint;
  status: 'open' | 'filled' | 'expired';
  txHash: string;
}

export function createCropFuture(
  owner: Address,
  cropType: string,
  quantity: bigint,
  price: bigint,
  deliveryDate: bigint
): CropFuture {
  return {
    id: BigInt(Date.now()),
    owner,
    cropType,
    quantity,
    price,
    deliveryDate,
    status: 'open',
    txHash: '',
  };
}

export function fillFuture(
  future: CropFuture,
  buyer: Address
): CropFuture {
  return {
    ...future,
    status: 'filled',
  };
}

export function getTotalValue(future: CropFuture): bigint {
  return future.quantity * future.price;
}
