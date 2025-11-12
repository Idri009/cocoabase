import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createEquipmentListing,
  purchaseEquipment,
  getAvailableEquipment,
  getEquipmentByCondition,
  type EquipmentListing,
} from '@/lib/onchain-farm-equipment-marketplace-utils';

export function useOnchainFarmEquipmentMarketplace() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [listings, setListings] = useState<EquipmentListing[]>([]);
  const [isListing, setIsListing] = useState(false);

  const list = async (
    equipment: string,
    condition: 'new' | 'used' | 'refurbished',
    price: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    setIsListing(true);
    try {
      const listing = createEquipmentListing(address, equipment, condition, price);
      console.log('Listing equipment:', listing);
    } finally {
      setIsListing(false);
    }
  };

  return {
    listings,
    list,
    purchaseEquipment,
    getAvailableEquipment,
    getEquipmentByCondition,
    isListing,
    address,
  };
}
