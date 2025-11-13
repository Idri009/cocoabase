import { type Address } from 'viem';

/**
 * Onchain farm agricultural extension utilities
 * Extension service request and completion
 */

export interface ExtensionService {
  id: string;
  requester: Address;
  serviceType: string;
  description: string;
  requestedDate: bigint;
  outcome?: string;
  completed: boolean;
  timestamp: bigint;
}

export function createExtensionService(
  address: Address,
  serviceType: string,
  description: string,
  requestedDate: bigint
): ExtensionService {
  return {
    id: `${Date.now()}-${Math.random()}`,
    requester: address,
    serviceType,
    description,
    requestedDate,
    completed: false,
    timestamp: BigInt(Date.now()),
  };
}

