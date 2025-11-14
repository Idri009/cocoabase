import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createStorageRecord,
  type StorageRecord,
} from '@/lib/onchain-farm-grain-storage-utils';

/**
 * Hook for onchain farm grain storage
 * Uses Reown wallet for all transactions
 */
export function useOnchainFarmGrainStorage() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [storageRecords, setStorageRecords] = useState<StorageRecord[]>([]);

  const storeGrain = async (
    contractAddress: Address,
    grainType: string,
    quantity: bigint,
    expiryDate: bigint,
    storageLocation: string,
    temperature: bigint,
    humidity: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    
    const record = createStorageRecord(
      address,
      grainType,
      quantity,
      expiryDate,
      storageLocation,
      temperature,
      humidity
    );
    
    await writeContract({
      address: contractAddress,
      abi: [
        {
          inputs: [
            { name: 'grainType', type: 'string' },
            { name: 'quantity', type: 'uint256' },
            { name: 'expiryDate', type: 'uint256' },
            { name: 'storageLocation', type: 'string' },
            { name: 'temperature', type: 'uint256' },
            { name: 'humidity', type: 'uint256' }
          ],
          name: 'storeGrain',
          outputs: [{ name: '', type: 'uint256' }],
          stateMutability: 'nonpayable',
          type: 'function'
        }
      ],
      functionName: 'storeGrain',
      args: [grainType, quantity, expiryDate, storageLocation, temperature, humidity],
    });
    
    setStorageRecords([...storageRecords, record]);
  };

  const retrieveGrain = async (
    contractAddress: Address,
    storageId: bigint,
    quantity: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    
    await writeContract({
      address: contractAddress,
      abi: [
        {
          inputs: [
            { name: 'storageId', type: 'uint256' },
            { name: 'quantity', type: 'uint256' }
          ],
          name: 'retrieveGrain',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function'
        }
      ],
      functionName: 'retrieveGrain',
      args: [storageId, quantity],
    });
  };

  const inspectStorage = async (
    contractAddress: Address,
    storageId: bigint,
    temperature: bigint,
    humidity: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    
    await writeContract({
      address: contractAddress,
      abi: [
        {
          inputs: [
            { name: 'storageId', type: 'uint256' },
            { name: 'temperature', type: 'uint256' },
            { name: 'humidity', type: 'uint256' }
          ],
          name: 'inspectStorage',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function'
        }
      ],
      functionName: 'inspectStorage',
      args: [storageId, temperature, humidity],
    });
  };

  return { 
    storageRecords, 
    storeGrain, 
    retrieveGrain,
    inspectStorage,
    address 
  };
}

