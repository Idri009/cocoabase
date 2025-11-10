import { type Address } from 'viem';

export interface TokenBurn {
  id: bigint;
  token: Address;
  burner: Address;
  amount: bigint;
  timestamp: bigint;
  reason: string;
}

export function createTokenBurn(
  token: Address,
  burner: Address,
  amount: bigint,
  reason: string
): TokenBurn {
  return {
    id: BigInt(0),
    token,
    burner,
    amount,
    timestamp: BigInt(Date.now()),
    reason,
  };
}

export function calculateTotalBurned(
  burns: TokenBurn[]
): bigint {
  return burns.reduce((total, burn) => total + burn.amount, BigInt(0));
}

export function getBurnsByToken(
  burns: TokenBurn[],
  token: Address
): TokenBurn[] {
  return burns.filter((burn) => burn.token === token);
}

export function getBurnsByBurner(
  burns: TokenBurn[],
  burner: Address
): TokenBurn[] {
  return burns.filter((burn) => burn.burner === burner);
}
