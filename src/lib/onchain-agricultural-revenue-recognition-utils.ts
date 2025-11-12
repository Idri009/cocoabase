import { type Address } from 'viem';

export interface RevenueRecord {
  id: bigint;
  owner: Address;
  revenueSource: string;
  amount: bigint;
  recognitionDate: bigint;
  period: string;
  txHash: string;
}

export function recognizeRevenue(
  owner: Address,
  revenueSource: string,
  amount: bigint,
  period: string
): RevenueRecord {
  return {
    id: BigInt(Date.now()),
    owner,
    revenueSource,
    amount,
    recognitionDate: BigInt(Date.now()),
    period,
    txHash: '',
  };
}
