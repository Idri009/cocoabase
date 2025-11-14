import { type Address } from 'viem';

export interface PollinationEvent {
  id: string;
  plantationId: bigint;
  cropType: string;
  pollinatorType: string;
  pollinatorCount: bigint;
  successRate: bigint;
  manager: Address;
}

export function createPollinationEvent(
  address: Address,
  plantationId: bigint,
  cropType: string,
  pollinatorType: string,
  pollinatorCount: bigint,
  successRate: bigint
): PollinationEvent {
  return {
    id: `${Date.now()}-${Math.random()}`,
    plantationId,
    cropType,
    pollinatorType,
    pollinatorCount,
    successRate,
    manager: address,
  };
}

