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
