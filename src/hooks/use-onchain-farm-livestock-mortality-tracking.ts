import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createMortalityRecord,
  type MortalityRecord,
} from '@/lib/onchain-farm-livestock-mortality-tracking-utils';

export function useOnchainFarmLivestockMortalityTracking() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [records, setRecords] = useState<MortalityRecord[]>([]);

  const recordMortality = async (
    contractAddress: Address,
    livestockId: bigint,
    cause: string,
    age: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    
    const record = createMortalityRecord(
      address,
      livestockId,
      cause,
      age
    );
    
    await writeContract({
      address: contractAddress,
      abi: [
        {
          inputs: [
            { name: 'livestockId', type: 'uint256' },
            { name: 'cause', type: 'string' },
            { name: 'age', type: 'uint256' }
          ],
          name: 'recordMortality',
          outputs: [{ name: '', type: 'uint256' }],
          stateMutability: 'nonpayable',
          type: 'function'
        }
      ],
      functionName: 'recordMortality',
      args: [livestockId, cause, age],
    });
    
    setRecords([...records, record]);
  };

  return { 
    records, 
    recordMortality, 
    address 
  };
}
