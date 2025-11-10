import { type Address } from 'viem';

/**
 * Onchain liquidation utilities
 * Automated liquidation system for undercollateralized positions
 */

export interface Liquidation {
  id: bigint;
  liquidatedUser: Address;
  liquidator: Address;
  collateral: bigint;
  debt: bigint;
  bonus: bigint;
  timestamp: bigint;
}

export function canLiquidate(
  collateral: bigint,
  debt: bigint,
  liquidationThreshold: bigint
): boolean {
  if (debt === BigInt(0)) return false;
  const collateralRatio = (collateral * BigInt(10000)) / debt;
  return collateralRatio < liquidationThreshold;
}

export function calculateLiquidationBonus(
  collateral: bigint,
  bonusPercent: bigint = BigInt(500)
): bigint {
  return (collateral * bonusPercent) / BigInt(10000);
}

