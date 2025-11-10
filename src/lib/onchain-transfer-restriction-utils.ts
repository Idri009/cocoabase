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

export function restrictAddress(
  restriction: TransferRestriction,
  address: Address
): TransferRestriction {
  const newRestricted = new Set(restriction.restricted);
  newRestricted.add(address);
  return {
    ...restriction,
    restricted: newRestricted,
  };
}

export function whitelistAddress(
  restriction: TransferRestriction,
  address: Address
): TransferRestriction {
  const newWhitelist = new Set(restriction.whitelist);
  newWhitelist.add(address);
  return {
    ...restriction,
    whitelist: newWhitelist,
  };
}

export function canTransfer(
  restriction: TransferRestriction,
  from: Address,
  to: Address,
  amount: bigint
): boolean {
  if (restriction.restricted.has(from) || restriction.restricted.has(to)) {
    return false;
  }
  if (restriction.whitelist.has(from) || restriction.whitelist.has(to)) {
    return true;
  }
  if (amount < restriction.minAmount || amount > restriction.maxAmount) {
    return false;
  }
  return true;
}
