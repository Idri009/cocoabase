import { type Address } from 'viem';

export interface CollateralManager {
  id: bigint;
  collateralToken: Address;
  debtToken: Address;
  liquidationThreshold: number;
  collateralRatio: number;
}

export interface CollateralPosition {
  owner: Address;
  collateral: bigint;
  debt: bigint;
  ratio: number;
}

export function createCollateralManager(
  collateralToken: Address,
  debtToken: Address,
  liquidationThreshold: number
): CollateralManager {
  return {
    id: BigInt(0),
    collateralToken,
    debtToken,
    liquidationThreshold,
    collateralRatio: 0,
  };
}

export function addCollateral(
  manager: CollateralManager,
  owner: Address,
  collateral: bigint,
  debt: bigint,
  collateralPrice: bigint,
  debtPrice: bigint
): { manager: CollateralManager; position: CollateralPosition } {
  const collateralValue = collateral * collateralPrice;
  const debtValue = debt * debtPrice;
  const ratio = debtValue > BigInt(0)
    ? Number((collateralValue * BigInt(10000)) / debtValue) / 100
    : 0;
  return {
    manager: {
      ...manager,
      collateralRatio: ratio,
    },
    position: {
      owner,
      collateral,
      debt,
      ratio,
    },
  };
}

export function isLiquidatable(
  position: CollateralPosition,
  threshold: number
): boolean {
  return position.ratio < threshold;
}
