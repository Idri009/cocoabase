import { type Address } from 'viem';

export interface EfficiencyMetric {
  id: bigint;
  owner: Address;
  resourceType: string;
  inputAmount: bigint;
  outputAmount: bigint;
  efficiencyRatio: number;
  metricDate: bigint;
  txHash: string;
}

export function createEfficiencyMetric(
  owner: Address,
  resourceType: string,
  inputAmount: bigint,
  outputAmount: bigint
): EfficiencyMetric {
  const efficiencyRatio = Number(outputAmount) / Number(inputAmount);
  return {
    id: BigInt(Date.now()),
    owner,
    resourceType,
    inputAmount,
    outputAmount,
    efficiencyRatio,
    metricDate: BigInt(Date.now()),
    txHash: '',
  };
}
