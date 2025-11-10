import { type Address } from 'viem';

export interface Liquidation {
  id: bigint;
  borrower: Address;
  collateral: bigint;
  collateralToken: Address;
  debt: bigint;
  debtToken: Address;
  liquidator: Address;
  liquidationBonus: number;
  status: 'pending' | 'executed' | 'failed';
  createdAt: bigint;
}

export function createLiquidation(
  borrower: Address,
  collateral: bigint,
  collateralToken: Address,
  debt: bigint,
  debtToken: Address,
  liquidationBonus: number
): Liquidation {
  const now = BigInt(Date.now());
  return {
    id: BigInt(0),
    borrower,
    collateral,
    collateralToken,
    debt,
    debtToken,
    liquidator: '0x0' as Address,
    liquidationBonus,
    status: 'pending',
    createdAt: now,
  };
}

export function executeLiquidation(
  liquidation: Liquidation,
  liquidator: Address
): Liquidation | null {
  if (liquidation.status !== 'pending') return null;

  return {
    ...liquidation,
    liquidator,
    status: 'executed',
  };
}

export function calculateLiquidationBonus(
  collateral: bigint,
  bonusPercent: number
): bigint {
  return (collateral * BigInt(Math.floor(bonusPercent * 100))) / BigInt(10000);
}

export function isLiquidationProfitable(
  liquidation: Liquidation,
  collateralPrice: bigint,
  debtPrice: bigint
): boolean {
  const collateralValue = liquidation.collateral * collateralPrice;
  const debtValue = liquidation.debt * debtPrice;
  const bonus = calculateLiquidationBonus(
    liquidation.collateral,
    liquidation.liquidationBonus
  );
  return collateralValue + bonus > debtValue;
}
