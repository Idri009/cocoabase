import { type Address } from 'viem';

export interface BondingCurve {
  id: bigint;
  token: Address;
  reserveToken: Address;
  virtualReserve: bigint;
  virtualSupply: bigint;
  k: bigint;
}

export function createBondingCurve(
  token: Address,
  reserveToken: Address,
  virtualReserve: bigint,
  virtualSupply: bigint
): BondingCurve {
  const k = virtualReserve * virtualSupply;
  return {
    id: BigInt(0),
    token,
    reserveToken,
    virtualReserve,
    virtualSupply,
    k,
  };
}

