import { useState } from 'react';
import { useAccount } from 'wagmi';
import {
  addEquipment,
  type EquipmentInventory,
} from '@/lib/onchain-equipment-inventory-management-utils';

export function useOnchainEquipmentInventoryManagement() {
  const { address } = useAccount();
  const [inventory, setInventory] = useState<EquipmentInventory[]>([]);

  const add = async (
    equipmentName: string,
    quantity: bigint,
    location: string
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected');
    const equipment = addEquipment(address, equipmentName, quantity, location);
    setInventory([...inventory, equipment]);
  };

  return { inventory, add, address };
}
