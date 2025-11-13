import { type Address } from 'viem';

/**
 * Onchain farm crop harvest logistics utilities
 * Harvest logistics creation and delivery confirmation
 */

export interface HarvestLogistics {
  id: string;
  harvestId: string;
  createdBy: Address;
  transportMethod: string;
  destination: string;
  estimatedArrival: bigint;
  delivered: boolean;
  timestamp: bigint;
}

export function createLogisticsRecord(
  address: Address,
  harvestId: string,
  transportMethod: string,
  destination: string,
  estimatedArrival: bigint
): HarvestLogistics {
  return {
    id: `${Date.now()}-${Math.random()}`,
    harvestId,
    createdBy: address,
    transportMethod,
    destination,
    estimatedArrival,
    delivered: false,
    timestamp: BigInt(Date.now()),
  };
}

