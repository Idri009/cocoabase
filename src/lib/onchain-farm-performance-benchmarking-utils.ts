import { type Address } from 'viem';

export interface Benchmark {
  id: bigint;
  creator: Address;
  metric: string;
  targetValue: bigint;
  actualValue: bigint;
  timestamp: bigint;
}

export function createBenchmark(
  creator: Address,
  metric: string,
  targetValue: bigint,
  actualValue: bigint
): Benchmark {
  return {
    id: BigInt(0),
    creator,
    metric,
    targetValue,
    actualValue,
    timestamp: BigInt(Date.now()),
  };
}

export function calculatePerformance(benchmark: Benchmark): bigint {
  if (benchmark.targetValue === BigInt(0)) return BigInt(0);
  return (benchmark.actualValue * BigInt(100)) / benchmark.targetValue;
}

export function getBenchmarksByMetric(
  benchmarks: Benchmark[],
  metric: string
): Benchmark[] {
  return benchmarks.filter((b) => b.metric === metric);
}

export function isTargetMet(benchmark: Benchmark): boolean {
  return benchmark.actualValue >= benchmark.targetValue;
}
