import { type Address } from 'viem';

/**
 * Onchain farm quality assurance utilities
 * Quality check creation and certification
 */

export interface QualityCheck {
  id: string;
  productId: string;
  inspector: Address;
  qualityScore: number;
  inspectorNotes: string;
  certified: boolean;
  timestamp: bigint;
}

export function createQualityCheck(
  address: Address,
  productId: string,
  qualityScore: number,
  inspectorNotes: string
): QualityCheck {
  return {
    id: `${Date.now()}-${Math.random()}`,
    productId,
    inspector: address,
    qualityScore,
    inspectorNotes,
    certified: false,
    timestamp: BigInt(Date.now()),
  };
}

