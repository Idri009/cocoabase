import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createResistanceRecord,
  type ResistanceRecord,
} from '@/lib/onchain-farm-crop-pest-resistance-tracking-utils';

/**
 * Hook for onchain crop pest resistance tracking
 * Uses Reown wallet for all transactions
 */
export function useOnchainFarmCropPestResistanceTracking() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [resistanceRecords, setResistanceRecords] = useState<ResistanceRecord[]>([]);

  const recordResistance = async (
    contractAddress: Address,
    plantationId: bigint,
    cropType: string,
    pestType: string,
    resistanceLevel: bigint,
    testMethod: string
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    
    const record = createResistanceRecord(
      address,
      plantationId,
      cropType,
      pestType,
      resistanceLevel,
      testMethod
    );
    
    await writeContract({
      address: contractAddress,
      abi: [
        {
          inputs: [
            { name: 'plantationId', type: 'uint256' },
            { name: 'cropType', type: 'string' },
            { name: 'pestType', type: 'string' },
            { name: 'resistanceLevel', type: 'uint256' },
            { name: 'testMethod', type: 'string' }
          ],
          name: 'recordResistance',
          outputs: [{ name: '', type: 'uint256' }],
          stateMutability: 'nonpayable',
          type: 'function'
        }
      ],
      functionName: 'recordResistance',
      args: [plantationId, cropType, pestType, resistanceLevel, testMethod],
    });
    
    setResistanceRecords([...resistanceRecords, record]);
  };

  const verifyResistance = async (
    contractAddress: Address,
    recordId: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    
    await writeContract({
      address: contractAddress,
      abi: [
        {
          inputs: [{ name: 'recordId', type: 'uint256' }],
          name: 'verifyResistance',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function'
        }
      ],
      functionName: 'verifyResistance',
      args: [recordId],
    });
  };

  return { 
    resistanceRecords, 
    recordResistance, 
    verifyResistance, 
    address 
  };
}


