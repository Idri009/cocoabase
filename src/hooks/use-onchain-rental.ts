import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createRental,
  activateRental,
  completeRental,
  cancelRental,
  calculateRentalCost,
  calculateRemainingDays,
  type Rental,
} from '@/lib/onchain-rental-utils';

export function useOnchainRental() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [isActivating, setIsActivating] = useState(false);

  const createNewRental = async (
    renter: Address,
    tokenId: bigint,
    contract: Address,
    pricePerDay: bigint,
    token: Address,
    duration: bigint,
    collateral: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected');
    setIsCreating(true);
    try {
      const rental = createRental(
        address,
        renter,
        tokenId,
        contract,
        pricePerDay,
        token,
        duration,
        collateral
      );
      console.log('Creating rental:', rental);
    } finally {
      setIsCreating(false);
    }
  };

  const activateRentalContract = async (rentalId: bigint): Promise<void> => {
    if (!address) throw new Error('Wallet not connected');
    setIsActivating(true);
    try {
      const currentTime = BigInt(Date.now());
      const rental = rentals.find((r) => r.id === rentalId);
      if (!rental) throw new Error('Rental not found');
      const updated = activateRental(rental, currentTime);
      if (updated) {
        console.log('Activating rental:', { rentalId, address });
      }
    } finally {
      setIsActivating(false);
    }
  };

  return {
    rentals,
    createNewRental,
    activateRentalContract,
    completeRental,
    cancelRental,
    calculateRentalCost,
    calculateRemainingDays,
    isCreating,
    isActivating,
    address,
  };
}

