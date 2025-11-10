import { useState } from 'react';
import { useAccount } from 'wagmi';
import {
  listEquipmentForRental,
  type EquipmentRental,
} from '@/lib/onchain-farm-equipment-rental-marketplace-utils';

export function useOnchainFarmEquipmentRentalMarketplace() {
  const { address } = useAccount();
  const [rentals, setRentals] = useState<EquipmentRental[]>([]);

  const listEquipment = async (
    equipmentType: string,
    dailyRate: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected');
    const rental = listEquipmentForRental(address, equipmentType, dailyRate);
    setRentals([...rentals, rental]);
  };

  return { rentals, listEquipment, address };
}
