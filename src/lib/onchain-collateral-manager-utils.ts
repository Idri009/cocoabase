import { type Address } from 'viem';

export interface CollateralManager {
  id: bigint;
  collateralToken: Address;
  debtToken: Address;
  collateralRatio: number;
  liquidations: bigint;
}

export interface CollateralPosition {
  borrower: Address;
  collateral: bigint;
  debt: bigint;
  ratio: number;
}

export function createCollateralManager(
  collateralToken: Address,
  debtToken: Address,
  collateralRatio: number
): CollateralManager {
  return {
    id: BigInt(0),
    collateralToken,
    debtToken,
    collateralRatio,
    liquidations: BigInt(0),
  };
}

export function calculateCollateralRatio(
  collateral: bigint,
  debt: bigint,
  collateralPrice: bigint,
  debtPrice: bigint
): number {
  if (debt === BigInt(0)) return 0;
  const collateralValue = collateral * collateralPrice;
  const debtValue = debt * debtPrice;
  return Number((collateralValue * BigInt(10000)) / debtValue) / 100;
}

export function isLiquidatable(
  position: CollateralPosition,
  manager: CollateralManager
): boolean {
  return position.ratio < manager.collateralRatio;
}

export function liquidatePosition(
  manager: CollateralManager,
  position: CollateralPosition
): CollateralManager {
  return {
    ...manager,
    liquidations: manager.liquidations + BigInt(1),
  };
}
