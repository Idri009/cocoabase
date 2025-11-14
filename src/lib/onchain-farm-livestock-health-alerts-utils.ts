import { type Address } from 'viem';

/**
 * Onchain farm livestock health alerts utilities
 * Health alert creation on blockchain
 */

export interface HealthAlert {
  id: string;
  animalId: string;
  createdBy: Address;
  alertType: string;
  severity: string;
  message: string;
  alertDate: bigint;
  acknowledged: boolean;
  timestamp: bigint;
}

export function createHealthAlert(
  address: Address,
  animalId: string,
  alertType: string,
  severity: string,
  message: string,
  alertDate: bigint
): HealthAlert {
  return {
    id: `${Date.now()}-${Math.random()}`,
    animalId,
    createdBy: address,
    alertType,
    severity,
    message,
    alertDate,
    acknowledged: false,
    timestamp: BigInt(Date.now()),
  };
}

