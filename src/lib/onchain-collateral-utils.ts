import { type Address } from 'viem';

/**
 * Onchain collateralization utilities
 * Collateral management and liquidation
 */

export interface Collateral {
  id: bigint;
  owner: Address;
  asset: Address;
  amount: bigint;
  value: bigint;
  liquidationThreshold: bigint;
  createdAt: bigint;
}

export interface Loan {
  id: bigint;
  borrower: Address;
  collateral: bigint;
  debt: bigint;
  interestRate: number;
  createdAt: bigint;
  liquidated: boolean;
}

export function createCollateral(
  owner: Address,
  asset: Address,
  amount: bigint,
  value: bigint,
  threshold: number = 150
): Collateral {
  return {
    id: BigInt(0),
    owner,
    asset,
    amount,
    value,
    liquidationThreshold: (value * BigInt(threshold)) / BigInt(100),
    createdAt: BigInt(Date.now()),
  };
}

export function calculateCollateralRatio(
  collateral: Collateral,
  debt: bigint
): number {
  if (debt === BigInt(0)) return Infinity;
  return (Number(collateral.value) / Number(debt)) * 100;
}

export function isCollateralLiquidatable(
  collateral: Collateral,
  debt: bigint
): boolean {
  return collateral.value < collateral.liquidationThreshold || 
         calculateCollateralRatio(collateral, debt) < 150;
}

export function calculateLiquidationBonus(
  collateralValue: bigint,
  bonusPercent: number = 5
): bigint {
  return (collateralValue * BigInt(bonusPercent)) / BigInt(100);
}

export function updateCollateralValue(
  collateral: Collateral,
  newValue: bigint
): Collateral {
  return {
    ...collateral,
    value: newValue,
    liquidationThreshold: (newValue * BigInt(150)) / BigInt(100),
  };
}

export function validateCollateralAmount(
  amount: bigint,
  minAmount: bigint = BigInt(0)
): boolean {
  return amount > minAmount;
}

export function calculateMaxLoan(
  collateral: Collateral,
  ltv: number = 80
): bigint {
  return (collateral.value * BigInt(ltv)) / BigInt(100);
}
