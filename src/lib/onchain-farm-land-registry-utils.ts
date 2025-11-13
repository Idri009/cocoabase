import { type Address } from 'viem';

/**
 * Onchain farm land registry utilities
 * Land parcel registration and ownership management
 */

export interface LandRegistry {
  id: string;
  parcelId: string;
  owner: Address;
  area: bigint;
  coordinates: string;
  legalDocHash: string;
  registeredAt: bigint;
}

export function registerLand(
  address: Address,
  parcelId: string,
  area: bigint,
  coordinates: string,
  legalDocHash: string
): LandRegistry {
  return {
    id: `${Date.now()}-${Math.random()}`,
    parcelId,
    owner: address,
    area,
    coordinates,
    legalDocHash,
    registeredAt: BigInt(Date.now()),
  };
}

