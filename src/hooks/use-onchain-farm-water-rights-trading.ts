import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createWaterRight,
  type WaterRight,
} from '@/lib/onchain-farm-water-rights-trading-utils';

/**
 * Hook for onchain water rights trading
 * Uses Reown wallet for all transactions
 */
export function useOnchainFarmWaterRightsTrading() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [waterRights, setWaterRights] = useState<WaterRight[]>([]);

  const listWaterRight = async (
    contractAddress: Address,
    waterAmount: bigint,
    price: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    
    const waterRight = createWaterRight(address, waterAmount, price);
    
    await writeContract({
      address: contractAddress,
      abi: [
        {
          inputs: [
            { name: 'waterAmount', type: 'uint256' },
            { name: 'price', type: 'uint256' }
          ],
          name: 'listWaterRight',
          outputs: [{ name: '', type: 'uint256' }],
          stateMutability: 'nonpayable',
          type: 'function'
        }
      ],
      functionName: 'listWaterRight',
      args: [waterAmount, price],
    });
    
    setWaterRights([...waterRights, waterRight]);
  };

  const purchaseWaterRight = async (
    contractAddress: Address,
    rightId: bigint,
    value: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    
    await writeContract({
      address: contractAddress,
      abi: [
        {
          inputs: [{ name: 'rightId', type: 'uint256' }],
          name: 'purchaseWaterRight',
          outputs: [],
          stateMutability: 'payable',
          type: 'function'
        }
      ],
      functionName: 'purchaseWaterRight',
      args: [rightId],
      value,
    });
  };

  return { 
    waterRights, 
    listWaterRight, 
    purchaseWaterRight, 
    address 
  };
}
