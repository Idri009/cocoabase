import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createBreedingRecord,
  type BreedingRecord,
} from '@/lib/onchain-farm-livestock-breeding-utils';

export function useOnchainFarmLivestockBreeding() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [records, setRecords] = useState<BreedingRecord[]>([]);

  const recordBreeding = async (
    contractAddress: Address,
    sireId: bigint,
    damId: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    
    const record = createBreedingRecord(address, sireId, damId);
    
    await writeContract({
      address: contractAddress,
      abi: [
        {
          inputs: [
            { name: 'sireId', type: 'uint256' },
            { name: 'damId', type: 'uint256' }
          ],
          name: 'recordBreeding',
          outputs: [{ name: '', type: 'uint256' }],
          stateMutability: 'nonpayable',
          type: 'function'
        }
      ],
      functionName: 'recordBreeding',
      args: [sireId, damId],
    });
    
    setRecords([...records, record]);
  };

  return { records, recordBreeding, address };
}
