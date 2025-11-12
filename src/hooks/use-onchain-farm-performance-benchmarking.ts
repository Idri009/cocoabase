import { useState } from 'react';
import { useAccount } from 'wagmi';
import type { Address } from 'viem';
import {
  createBenchmark,
  calculatePerformance,
  getBenchmarksByMetric,
  isTargetMet,
  type Benchmark,
} from '@/lib/onchain-farm-performance-benchmarking-utils';

export function useOnchainFarmPerformanceBenchmarking() {
  const { address } = useAccount();
  const [benchmarks, setBenchmarks] = useState<Benchmark[]>([]);

  const create = (
    metric: string,
    targetValue: bigint,
    actualValue: bigint
  ) => {
    if (!address) throw new Error('Wallet not connected via Reown');
    const benchmark = createBenchmark(
      address,
      metric,
      targetValue,
      actualValue
    );
    setBenchmarks((prev) => [...prev, benchmark]);
    console.log('Creating benchmark:', { metric, targetValue });
  };

  return {
    benchmarks,
    create,
    calculatePerformance,
    getBenchmarksByMetric,
    isTargetMet,
    address,
  };
}
