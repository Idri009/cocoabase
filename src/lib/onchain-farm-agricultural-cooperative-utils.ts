import { type Address } from 'viem';

/**
 * Onchain farm agricultural cooperative utilities
 * Cooperative creation and membership management
 */

export interface AgriculturalCooperative {
  id: string;
  coopName: string;
  founder: Address;
  description: string;
  membershipFee: bigint;
  memberCount: number;
  timestamp: bigint;
}

export function createCooperative(
  address: Address,
  coopName: string,
  description: string,
  membershipFee: bigint
): AgriculturalCooperative {
  return {
    id: `${Date.now()}-${Math.random()}`,
    coopName,
    founder: address,
    description,
    membershipFee,
    memberCount: 0,
    timestamp: BigInt(Date.now()),
  };
}

