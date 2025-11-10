import { type Address } from 'viem';

export interface Liquidation {
  id: bigint;
  liquidatedUser: Address;
  liquidator: Address;
  collateral: bigint;
  debt: bigint;
  bonus: bigint;
  timestamp: bigint;
}

