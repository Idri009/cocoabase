import { type Address } from 'viem';

export interface TransferRestriction {
  id: bigint;
  token: Address;
  restricted: Set<Address>;
  minAmount: bigint;
  maxAmount: bigint;
  whitelist: Set<Address>;
}

export function createTransferRestriction(
  token: Address,
  minAmount: bigint,
  maxAmount: bigint
): TransferRestriction {
  return {
    id: BigInt(0),
    token,
    restricted: new Set(),
    minAmount,
    maxAmount,
    whitelist: new Set(),
  };
}

