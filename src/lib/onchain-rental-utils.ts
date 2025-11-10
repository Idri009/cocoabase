import { type Address } from 'viem';

export interface Rental {
  id: bigint;
  owner: Address;
  renter: Address;
  tokenId: bigint;
  contract: Address;
  pricePerDay: bigint;
  token: Address;
  startTime: bigint;
  endTime: bigint;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  collateral: bigint;
  totalPaid: bigint;
}

export function createRental(
  owner: Address,
  renter: Address,
  tokenId: bigint,
  contract: Address,
  pricePerDay: bigint,
  token: Address,
  duration: bigint,
  collateral: bigint
): Rental {
  const now = BigInt(Date.now());
  return {
    id: BigInt(0),
    owner,
    renter,
    tokenId,
    contract,
    pricePerDay,
    token,
    startTime: now,
    endTime: now + duration,
    status: 'pending',
    collateral,
    totalPaid: BigInt(0),
  };
}

export function activateRental(
  rental: Rental,
  currentTime: bigint
): Rental | null {
  if (rental.status !== 'pending') return null;
  if (currentTime < rental.startTime) return null;

  return {
    ...rental,
    status: 'active',
  };
}

export function completeRental(
  rental: Rental,
  currentTime: bigint
): Rental | null {
  if (rental.status !== 'active') return null;
  if (currentTime < rental.endTime) return null;

  return {
    ...rental,
    status: 'completed',
  };
}

export function cancelRental(
  rental: Rental,
  canceller: Address
): Rental | null {
  if (rental.status === 'completed') return null;
  if (canceller !== rental.owner && canceller !== rental.renter) return null;

  return {
    ...rental,
    status: 'cancelled',
  };
}

export function calculateRentalCost(
  pricePerDay: bigint,
  days: bigint
): bigint {
  return pricePerDay * days;
}

export function calculateRemainingDays(
  rental: Rental,
  currentTime: bigint
): bigint {
  if (currentTime >= rental.endTime) return BigInt(0);
  if (currentTime < rental.startTime) return BigInt(0);
  const remaining = rental.endTime - currentTime;
  return remaining / BigInt(86400); // Convert seconds to days
}

