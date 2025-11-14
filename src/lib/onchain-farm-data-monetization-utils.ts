import { type Address } from 'viem';

export interface DataListing {
  id: string;
  listingId: bigint;
  dataType: string;
  price: bigint;
  seller: Address;
  buyer?: Address;
  listingDate: bigint;
  sold: boolean;
  metadata: string;
}

export function createDataListing(
  address: Address,
  dataType: string,
  price: bigint,
  metadata: string
): DataListing {
  return {
    id: `${Date.now()}-${Math.random()}`,
    listingId: BigInt(0),
    dataType,
    price,
    seller: address,
    listingDate: BigInt(Date.now()),
    sold: false,
    metadata,
  };
}
