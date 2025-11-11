import { type Address } from 'viem';

export interface MarketplaceListing {
  id: bigint;
  seller: Address;
  product: string;
  price: bigint;
  quantity: bigint;
  active: boolean;
}

export function createListing(
  seller: Address,
  product: string,
  price: bigint,
  quantity: bigint
): MarketplaceListing {
  return {
    id: BigInt(0),
    seller,
    product,
    price,
    quantity,
    active: true,
  };
}
