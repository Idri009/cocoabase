import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createDiseaseResistanceRecord,
  type DiseaseResistanceRecord,
} from '@/lib/onchain-farm-crop-disease-resistance-utils';

/**
 * Hook for onchain crop disease resistance tracking
 * Uses Reown wallet for all transactions
 */
export function useOnchainFarmCropDiseaseResistance() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [resistanceRecords, setResistanceRecords] = useState<DiseaseResistanceRecord[]>([]);

  const recordResistance = async (
    contractAddress: Address,
    plantationId: bigint,
    cropType: string,
    diseaseType: string,
    resistanceLevel: bigint,
    testMethod: string
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    
    const record = createDiseaseResistanceRecord(
      address,
      plantationId,
      cropType,
      diseaseType,
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
            { name: 'diseaseType', type: 'string' },
            { name: 'resistanceLevel', type: 'uint256' },
            { name: 'testMethod', type: 'string' }
          ],
          name: 'recordDiseaseResistance',
          outputs: [{ name: '', type: 'uint256' }],
          stateMutability: 'nonpayable',
          type: 'function'
        }
      ],
      functionName: 'recordDiseaseResistance',
      args: [plantationId, cropType, diseaseType, resistanceLevel, testMethod],
    });
    
    setResistanceRecords([...resistanceRecords, record]);
  };

  const detectOutbreak = async (
    contractAddress: Address,
    plantationId: bigint,
    diseaseType: string,
    severity: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    
    await writeContract({
      address: contractAddress,
      abi: [
        {
          inputs: [
            { name: 'plantationId', type: 'uint256' },
            { name: 'diseaseType', type: 'string' },
            { name: 'severity', type: 'uint256' }
          ],
          name: 'detectOutbreak',
          outputs: [{ name: '', type: 'uint256' }],
          stateMutability: 'nonpayable',
          type: 'function'
        }
      ],
      functionName: 'detectOutbreak',
      args: [plantationId, diseaseType, severity],
    });
  };

  return { 
    resistanceRecords, 
    recordResistance, 
    detectOutbreak, 
    address 
  };
}
