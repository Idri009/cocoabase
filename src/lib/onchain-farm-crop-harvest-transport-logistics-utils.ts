import { type Address } from 'viem';

/**
 * Onchain farm crop harvest transport logistics utilities
 * Transport logistic creation on blockchain
 */

export interface TransportLogistic {
  id: string;
  harvestId: string;
  createdBy: Address;
  vehicleType: string;
  driver: string;
  origin: string;
  destination: string;
  transportDate: bigint;
  completed: boolean;
  timestamp: bigint;
}

export function createTransportLogistic(
  address: Address,
  harvestId: string,
  vehicleType: string,
  driver: string,
  origin: string,
  destination: string,
  transportDate: bigint
): TransportLogistic {
  return {
    id: `${Date.now()}-${Math.random()}`,
    harvestId,
    createdBy: address,
    vehicleType,
    driver,
    origin,
    destination,
    transportDate,
    completed: false,
    timestamp: BigInt(Date.now()),
  };
}

