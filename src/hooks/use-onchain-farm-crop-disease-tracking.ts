import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createDiseaseRecord,
  type DiseaseRecord,
} from '@/lib/onchain-farm-crop-disease-tracking-utils';

export function useOnchainFarmCropDiseaseTracking() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [records, setRecords] = useState<DiseaseRecord[]>([]);

  const recordDisease = async (
    contractAddress: Address,
    plantationId: bigint,
    diseaseType: string,
    severity: bigint,
    treatment: string
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    
    const record = createDiseaseRecord(address, plantationId, diseaseType, severity, treatment);
    
    await writeContract({
      address: contractAddress,
      abi: [
        {
          inputs: [
            { name: 'plantationId', type: 'uint256' },
            { name: 'diseaseType', type: 'string' },
            { name: 'severity', type: 'uint256' },
            { name: 'treatment', type: 'string' }
          ],
          name: 'recordDisease',
          outputs: [{ name: '', type: 'uint256' }],
          stateMutability: 'nonpayable',
          type: 'function'
        }
      ],
      functionName: 'recordDisease',
      args: [plantationId, diseaseType, severity, treatment],
    });
    
    setRecords([...records, record]);
  };

  const markAsResolved = async (
    contractAddress: Address,
    recordId: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    
    await writeContract({
      address: contractAddress,
      abi: [
        {
          inputs: [{ name: 'recordId', type: 'uint256' }],
          name: 'markAsResolved',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function'
        }
      ],
      functionName: 'markAsResolved',
      args: [recordId],
    });
  };

  return { records, recordDisease, markAsResolved, address };
}
