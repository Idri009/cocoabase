import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createInventoryItem,
  type InventoryItem,
} from '@/lib/onchain-farm-inventory-management-utils';

export function useOnchainFarmInventoryManagement() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [items, setItems] = useState<InventoryItem[]>([]);

  const addInventoryItem = async (
    contractAddress: Address,
    itemName: string,
    category: string,
    quantity: bigint,
    unitPrice: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    
    const item = createInventoryItem(address, itemName, category, quantity, unitPrice);
    
    await writeContract({
      address: contractAddress,
      abi: [
        {
          inputs: [
            { name: 'itemName', type: 'string' },
            { name: 'category', type: 'string' },
            { name: 'quantity', type: 'uint256' },
            { name: 'unitPrice', type: 'uint256' }
          ],
          name: 'addInventoryItem',
          outputs: [{ name: '', type: 'uint256' }],
          stateMutability: 'nonpayable',
          type: 'function'
        }
      ],
      functionName: 'addInventoryItem',
      args: [itemName, category, quantity, unitPrice],
    });
    
    setItems([...items, item]);
  };

  return { items, addInventoryItem, address };
}
