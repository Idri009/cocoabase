import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createBenchmark,
  type Benchmark,
} from '@/lib/onchain-farm-performance-benchmarking-utils';

/**
 * Hook for onchain farm performance benchmarking
 * Uses Reown wallet for all transactions
 */
export function useOnchainFarmPerformanceBenchmarking() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [benchmarks, setBenchmarks] = useState<Benchmark[]>([]);

  const createBenchmark = async (
    contractAddress: Address,
    farmOwner: Address,
    benchmarkValue: bigint,
    metricType: string
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    
    await writeContract({
      address: contractAddress,
      abi: [
        {
          inputs: [
            { name: 'farmOwner', type: 'address' },
            { name: 'benchmarkValue', type: 'uint256' },
            { name: 'metricType', type: 'string' }
          ],
          name: 'createBenchmark',
          outputs: [{ name: '', type: 'uint256' }],
          stateMutability: 'nonpayable',
          type: 'function'
        }
      ],
      functionName: 'createBenchmark',
      args: [farmOwner, benchmarkValue, metricType],
    });
  };

  const updateBenchmark = async (
    contractAddress: Address,
    benchmarkId: bigint,
    actualValue: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    
    await writeContract({
      address: contractAddress,
      abi: [
        {
          inputs: [
            { name: 'benchmarkId', type: 'uint256' },
            { name: 'actualValue', type: 'uint256' }
          ],
          name: 'updateBenchmark',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function'
        }
      ],
      functionName: 'updateBenchmark',
      args: [benchmarkId, actualValue],
    });
  };

  return { 
    benchmarks, 
    createBenchmark, 
    updateBenchmark, 
    address 
  };
}
