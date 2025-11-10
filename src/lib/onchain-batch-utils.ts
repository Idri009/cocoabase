import { type Address } from 'viem';

export interface BatchTransaction {
  id: bigint;
  sender: Address;
  transactions: Transaction[];
  status: 'pending' | 'executed' | 'failed';
  gasEstimate: bigint;
}

export interface Transaction {
  to: Address;
  value: bigint;
  data: string;
}

export function createBatchTransaction(
  sender: Address,
  transactions: Transaction[]
): BatchTransaction {
  return {
    id: BigInt(0),
    sender,
    transactions,
    status: 'pending',
    gasEstimate: BigInt(0),
  };
}

export function estimateBatchGas(
  batch: BatchTransaction,
  gasPerTx: bigint
): bigint {
  return BigInt(batch.transactions.length) * gasPerTx;
}

export function executeBatch(batch: BatchTransaction): BatchTransaction {
  return { ...batch, status: 'executed' };
}
