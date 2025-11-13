import { type Address } from 'viem';

/**
 * Onchain farm crop harvest transport utilities
 * Transport record creation and completion
 */

export interface HarvestTransport {
  id: string;
  harvestId: string;
  createdBy: Address;
  vehicleType: string;
  driver: Address;
  destination: string;
  transportDate: bigint;
  completed: boolean;
  timestamp: bigint;
}

export function createTransportRecord(
  address: Address,
  harvestId: string,
  vehicleType: string,
  driver: Address,
  destination: string,
  transportDate: bigint
): HarvestTransport {
  return {
    id: `${Date.now()}-${Math.random()}`,
    harvestId,
    createdBy: address,
    vehicleType,
    driver,
    destination,
    transportDate,
    completed: false,
    timestamp: BigInt(Date.now()),
  };
}

