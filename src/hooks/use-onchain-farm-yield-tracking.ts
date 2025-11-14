import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createYieldRecord,
  type YieldRecord,
} from '@/lib/onchain-farm-yield-tracking-utils';

/**
 * Hook for onchain farm yield tracking
 * Uses Reown wallet for all transactions
 */
export function useOnchainFarmYieldTracking() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [yieldRecords, setYieldRecords] = useState<YieldRecord[]>([]);

  const recordYield = async (
    contractAddress: Address,
    cropId: bigint,
    cropType: string,
    fieldId: bigint,
    harvestDate: bigint,
    yieldAmount: bigint,
    area: bigint,
    location: string,
    quality: string
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    
    const record = createYieldRecord(address, cropId, cropType, fieldId, harvestDate, yieldAmount, area, location, quality);
    
    await writeContract({
      address: contractAddress,
      abi: [
        {
          inputs: [
            { name: 'cropId', type: 'uint256' },
            { name: 'cropType', type: 'string' },
            { name: 'fieldId', type: 'uint256' },
            { name: 'harvestDate', type: 'uint256' },
            { name: 'yieldAmount', type: 'uint256' },
            { name: 'area', type: 'uint256' },
            { name: 'location', type: 'string' },
            { name: 'quality', type: 'string' }
          ],
          name: 'recordYield',
          outputs: [{ name: '', type: 'uint256' }],
          stateMutability: 'nonpayable',
          type: 'function'
        }
      ],
      functionName: 'recordYield',
      args: [cropId, cropType, fieldId, harvestDate, yieldAmount, area, location, quality],
    });
    
    setYieldRecords([...yieldRecords, record]);
  };

  const updateYield = async (
    contractAddress: Address,
    recordId: bigint,
    yieldAmount: bigint,
    area: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    
    await writeContract({
      address: contractAddress,
      abi: [
        {
          inputs: [
            { name: 'recordId', type: 'uint256' },
            { name: 'yieldAmount', type: 'uint256' },
            { name: 'area', type: 'uint256' }
          ],
          name: 'updateYield',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function'
        }
      ],
      functionName: 'updateYield',
      args: [recordId, yieldAmount, area],
    });
  };

  return { 
    yieldRecords, 
    recordYield,
    updateYield,
    address 
  };
}

