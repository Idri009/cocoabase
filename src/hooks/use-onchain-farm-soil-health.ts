import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createSoilHealthRecord,
  type SoilHealthRecord,
} from '@/lib/onchain-farm-soil-health-utils';

/**
 * Hook for onchain farm soil health
 * Uses Reown wallet for all transactions
 */
export function useOnchainFarmSoilHealth() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [soilHealthRecords, setSoilHealthRecords] = useState<SoilHealthRecord[]>([]);

  const recordSoilHealth = async (
    contractAddress: Address,
    location: string,
    phLevel: bigint,
    nitrogenLevel: bigint,
    phosphorusLevel: bigint,
    potassiumLevel: bigint,
    organicMatter: bigint,
    soilType: string,
    healthStatus: string
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    
    const record = createSoilHealthRecord(address, location, phLevel, nitrogenLevel, phosphorusLevel, potassiumLevel, organicMatter, soilType, healthStatus);
    
    await writeContract({
      address: contractAddress,
      abi: [
        {
          inputs: [
            { name: 'location', type: 'string' },
            { name: 'phLevel', type: 'uint256' },
            { name: 'nitrogenLevel', type: 'uint256' },
            { name: 'phosphorusLevel', type: 'uint256' },
            { name: 'potassiumLevel', type: 'uint256' },
            { name: 'organicMatter', type: 'uint256' },
            { name: 'soilType', type: 'string' },
            { name: 'healthStatus', type: 'string' }
          ],
          name: 'recordSoilHealth',
          outputs: [{ name: '', type: 'uint256' }],
          stateMutability: 'nonpayable',
          type: 'function'
        }
      ],
      functionName: 'recordSoilHealth',
      args: [location, phLevel, nitrogenLevel, phosphorusLevel, potassiumLevel, organicMatter, soilType, healthStatus],
    });
    
    setSoilHealthRecords([...soilHealthRecords, record]);
  };

  return { 
    soilHealthRecords, 
    recordSoilHealth,
    address 
  };
}

