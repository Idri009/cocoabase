import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createPestRecord,
  type PestRecord,
} from '@/lib/onchain-farm-pest-management-utils';

export function useOnchainFarmPestManagement() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [records, setRecords] = useState<PestRecord[]>([]);

  const recordPest = async (
    contractAddress: Address,
    plantationId: bigint,
    pestType: string,
    severity: bigint,
    treatmentMethod: string
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    
    const record = createPestRecord(address, plantationId, pestType, severity, treatmentMethod);
    
    await writeContract({
      address: contractAddress,
      abi: [
        {
          inputs: [
            { name: 'plantationId', type: 'uint256' },
            { name: 'pestType', type: 'string' },
            { name: 'severity', type: 'uint256' },
            { name: 'treatmentMethod', type: 'string' }
          ],
          name: 'recordPest',
          outputs: [{ name: '', type: 'uint256' }],
          stateMutability: 'nonpayable',
          type: 'function'
        }
      ],
      functionName: 'recordPest',
      args: [plantationId, pestType, severity, treatmentMethod],
    });
    
    setRecords([...records, record]);
  };

  const markAsTreated = async (
    contractAddress: Address,
    recordId: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    
    await writeContract({
      address: contractAddress,
      abi: [
        {
          inputs: [{ name: 'recordId', type: 'uint256' }],
          name: 'markAsTreated',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function'
        }
      ],
      functionName: 'markAsTreated',
      args: [recordId],
    });
  };

  return { records, recordPest, markAsTreated, address };
}

