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

export function buyTokens(
  curve: BondingCurve,
  reserveAmount: bigint
): { curve: BondingCurve; tokensOut: bigint } {
  const newReserve = curve.virtualReserve + reserveAmount;
  const newSupply = curve.k / newReserve;
  const tokensOut = curve.virtualSupply - newSupply;
  return {
    curve: {
      ...curve,
      virtualReserve: newReserve,
      virtualSupply: newSupply,
    },
    tokensOut,
  };
}

export function sellTokens(
  curve: BondingCurve,
  tokenAmount: bigint
): { curve: BondingCurve; reserveOut: bigint } {
  const newSupply = curve.virtualSupply + tokenAmount;
  const newReserve = curve.k / newSupply;
  const reserveOut = curve.virtualReserve - newReserve;
  return {
    curve: {
      ...curve,
      virtualReserve: newReserve,
      virtualSupply: newSupply,
    },
    reserveOut,
  };
}
