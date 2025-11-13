import { type Address } from 'viem';

/**
 * Onchain farm pest monitoring utilities
 * Pest sighting and treatment tracking
 */

export interface PestMonitoring {
  id: string;
  plantationId: string;
  recordedBy: Address;
  pestType: string;
  severity: number;
  location: string;
  treated: boolean;
  timestamp: bigint;
}

export function createMonitoring(
  address: Address,
  plantationId: string,
  pestType: string,
  severity: number,
  location: string
): PestMonitoring {
  return {
    id: `${Date.now()}-${Math.random()}`,
    plantationId,
    recordedBy: address,
    pestType,
    severity,
    location,
    treated: false,
    timestamp: BigInt(Date.now()),
  };
}

