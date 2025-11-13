import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';

/**
 * Hook for onchain farm waste management
 * Uses Reown wallet for all transactions
 */
export function useOnchainFarmWasteManagement() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [records, setRecords] = useState<any[]>([]);

  const createWasteRecord = async (
    contractAddress: Address,
    wasteType: string,
    amount: bigint,
    disposalMethod: string
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    
    await writeContract({
      address: contractAddress,
      abi: [
        {
          inputs: [
            { name: 'wasteType', type: 'string' },
            { name: 'amount', type: 'uint256' },
            { name: 'disposalMethod', type: 'string' }
          ],
          name: 'createWasteRecord',
          outputs: [{ name: '', type: 'uint256' }],
          stateMutability: 'nonpayable',
          type: 'function'
        }
      ],
      functionName: 'createWasteRecord',
      args: [wasteType, amount, disposalMethod],
    });
  };

  const markAsRecycled = async (
    contractAddress: Address,
    recordId: bigint,
    recyclingValue: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    
    await writeContract({
      address: contractAddress,
      abi: [
        {
          inputs: [
            { name: 'recordId', type: 'uint256' },
            { name: 'recyclingValue', type: 'uint256' }
          ],
          name: 'markAsRecycled',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function'
        }
      ],
      functionName: 'markAsRecycled',
      args: [recordId, recyclingValue],
    });
  };

  return { 
    records, 
    createWasteRecord, 
    markAsRecycled, 
    address 
  };
}
