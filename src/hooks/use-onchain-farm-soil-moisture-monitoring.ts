import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createMoistureReading,
  type MoistureReading,
} from '@/lib/onchain-farm-soil-moisture-monitoring-utils';

/**
 * Hook for onchain soil moisture monitoring
 * Uses Reown wallet for all transactions
 */
export function useOnchainFarmSoilMoistureMonitoring() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [moistureReadings, setMoistureReadings] = useState<MoistureReading[]>([]);

  const recordMoisture = async (
    contractAddress: Address,
    fieldId: bigint,
    moistureLevel: bigint,
    depth: bigint,
    temperature: bigint,
    location: string
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    
    const reading = createMoistureReading(
      address,
      fieldId,
      moistureLevel,
      depth,
      temperature,
      location
    );
    
    await writeContract({
      address: contractAddress,
      abi: [
        {
          inputs: [
            { name: 'fieldId', type: 'uint256' },
            { name: 'moistureLevel', type: 'uint256' },
            { name: 'depth', type: 'uint256' },
            { name: 'temperature', type: 'uint256' },
            { name: 'location', type: 'string' }
          ],
          name: 'recordMoisture',
          outputs: [{ name: '', type: 'uint256' }],
          stateMutability: 'nonpayable',
          type: 'function'
        }
      ],
      functionName: 'recordMoisture',
      args: [fieldId, moistureLevel, depth, temperature, location],
    });
    
    setMoistureReadings([...moistureReadings, reading]);
  };

  return { 
    moistureReadings, 
    recordMoisture, 
    address 
  };
}



